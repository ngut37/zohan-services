import joiRouter, { Joi } from 'koa-joi-router';

import {
  ServiceName,
  ServiceType,
  SERVICE_NAMES,
  SERVICE_TYPES,
} from '@models/service';
import { Venue, VenueAttributes } from '@models/venue';
import { PipelineStage } from 'mongoose';

type RequestQuery = {
  region?: string;
  districts?: string[];
  mops?: string[];
  serviceType?: ServiceType;
  serviceNames?: ServiceName[];

  page: string;
  limit?: string;
};

const requestQuerySchema = {
  // location filter
  region: Joi.number().integer().min(1).optional(),
  districts: Joi.string().custom((value) => {
    const districts = JSON.parse(value) as any[];

    return districts.map(Number);
  }),
  mops: Joi.string().custom((value) => {
    const mops = JSON.parse(value) as any[];

    return mops.map(Number);
  }),

  serviceType: Joi.string().valid(...Object.values(SERVICE_TYPES)),

  // check that serviceNames is an array of valid service names
  serviceNames: Joi.string().custom((value, helpers) => {
    const serviceNames = JSON.parse(value) as any[];
    const validServiceNames = Object.keys(SERVICE_NAMES);

    const invalidServiceNames = serviceNames.filter(
      (serviceName) => !validServiceNames.includes(serviceName),
    );

    if (invalidServiceNames.length) {
      return helpers.error('any.invalid');
    }

    return serviceNames;
  }),

  // pagination
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
};

const router = joiRouter();

router.route({
  path: '/list',
  method: 'get',
  validate: {
    query: requestQuerySchema,
  },
  handler: [
    async (ctx) => {
      const query = ctx.request.query as RequestQuery;

      const {
        region,
        districts,
        mops,
        serviceType,
        serviceNames,

        page,
        limit,
      } = query;

      // build pipeline stages
      const pipelineStages: PipelineStage[] = [
        {
          $match: {
            ...(region ? { region } : {}),
            ...(districts ? { district: { $in: districts } } : {}),
            ...(mops ? { mop: { $in: mops } } : {}),
          },
        },

        // lookup company
        {
          $lookup: {
            from: 'companies',
            localField: 'company',
            foreignField: '_id',
            as: 'company',
          },
        },

        // lookup region, district, and mop
        {
          $lookup: {
            from: 'regions',
            localField: 'region',
            foreignField: '_id',
            as: 'region',
          },
        },
        {
          $lookup: {
            from: 'districts',
            localField: 'district',
            foreignField: '_id',
            as: 'district',
          },
        },
        {
          $lookup: {
            from: 'mops',
            localField: 'mop',
            foreignField: '_id',
            as: 'mop',
          },
        },
        {
          $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: 'venue',
            as: 'services',
          },
        },
      ];

      if (serviceNames?.length) {
        pipelineStages.push({
          $match: {
            'services.name': { $in: serviceNames },
          },
        });
      } else if (serviceType) {
        pipelineStages.push({
          $match: {
            'services.type': serviceType,
          },
        });
      }

      pipelineStages.push({
        $sort: {
          createdAt: -1,
        },
      });
      pipelineStages.push({
        $skip: (Number(page) - 1) * Number(limit),
      });
      pipelineStages.push({
        $limit: Number(limit),
      });
      pipelineStages.push(
        // project only names of region, district, and mop
        {
          $project: {
            name: 1,
            company: { $arrayElemAt: ['$company.name', 0] },
            stringAddress: 1,
            region: { $arrayElemAt: ['$region.name', 0] },
            district: { $arrayElemAt: ['$district.name', 0] },
            mop: { $arrayElemAt: ['$mop.name', 0] },
            services: '$services.type', // include the service types as an array
          },
        },
      );

      const aggregationResult = (await Venue.aggregate<any>(
        pipelineStages,
      ).exec()) as (VenueAttributes & {
        services?: ServiceType[];
        region?: string;
        district?: string;
        mop?: string;
      })[];

      // make services an array a set of unique values
      aggregationResult.forEach((venue) => {
        venue.services = [...new Set(venue.services)];
      });

      ctx.body = {
        success: true,
        data: aggregationResult,
      };
    },
  ],
});

export default router;
