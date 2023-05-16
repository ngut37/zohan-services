import joiRouter, { Joi } from 'koa-joi-router';

import { Service, ServiceName, SERVICE_NAMES } from '@models/service';
import { Venue, VenueAttributes } from '@models/venue';
import { PipelineStage } from 'mongoose';
import { Region } from '@models/region';
import { District } from '@models/district';
import { Momc } from '@models/momc';

type RequestQuery = {
  region?: string;
  district?: string;
  momc?: string;
  serviceNames?: ServiceName[];

  page: string;
  limit?: string;
};

const requestQuerySchema = {
  // location filter
  region: Joi.number().integer().min(1),
  district: Joi.number().integer().min(1),
  momc: Joi.number().integer().min(1),

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
      if (ctx.request.query) {
        console.log(ctx.request.query);
      }

      const query = ctx.request.query as RequestQuery;

      const {
        region,
        district,
        momc,
        serviceNames,

        page,
        limit,
      } = query;

      // build pipeline stages
      const pipelineStages: PipelineStage[] = [
        {
          $match: {
            ...(region ? { region } : {}),
            ...(district ? { district } : {}),
            ...(momc ? { momc } : {}),
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

        // lookup region, district, and momc
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
            from: 'momcs',
            localField: 'momc',
            foreignField: '_id',
            as: 'momc',
          },
        },

        // project only names of region, district, and momc
        {
          $project: {
            name: 1,
            company: { $arrayElemAt: ['$company.name', 0] },
            stringAddress: 1,
            region: { $arrayElemAt: ['$region.name', 0] },
            district: { $arrayElemAt: ['$district.name', 0] },
            momc: { $arrayElemAt: ['$momc.name', 0] },
          },
        },
      ];

      if (serviceNames?.length) {
        pipelineStages.push({
          $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: 'venue',
            as: 'services',
          },
        });

        pipelineStages.push({
          $match: {
            'services.name': { $in: serviceNames },
          },
        });

        pipelineStages.push({
          $project: {
            name: 1,
            company: 1,
            stringAddress: 1,
            region: 1,
            district: 1,
            momc: 1,
            services: '$services.type', // Include the service types as an array
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

      const aggregationResult = (await Venue.aggregate<any>(
        pipelineStages,
      ).exec()) as (VenueAttributes & {
        services?: Service[];
        region?: Region;
        district?: District;
        momc?: Momc;
      })[];

      // make services an array a set of unique values
      if (serviceNames?.length) {
        aggregationResult.forEach((venue) => {
          venue.services = [...new Set(venue.services)];
        });
      }

      ctx.body = {
        success: true,
        data: aggregationResult,
      };
    },
  ],
});

export default router;
