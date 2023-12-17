import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';
import { CompanyAccessTokenPayload } from '@utils/auth/company-auth';

import { Venue } from '@models/venue';
import { Coordinates } from '@models/types';

import { mapLocationToIds } from '../../utils/map-location-to-ids';

const router = joiRouter();

type RequestBody = {
  stringAddress: string;

  regionString: string;
  districtString: string;
  quarterString?: string; // momc
  coordinates: Coordinates; // momc
};

const requestBodySchema = {
  stringAddress: Joi.string().required(),

  regionString: Joi.string().required(),
  districtString: Joi.string().required(),
  quarterString: Joi.string().allow(''), // momc
  coordinates: Joi.array().items(Joi.number()).length(2).required(), // momc
};

router.route({
  path: '/create',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
      allowedRoles: ['admin', 'editor'],
    }),
    async (ctx) => {
      const body = ctx.request.body as RequestBody;
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      const {
        stringAddress,
        regionString,
        districtString,
        quarterString,
        coordinates,
      } = body;

      const { region, district, mop, momc } = await mapLocationToIds({
        regionString,
        districtString,
        quarterString,
        ctx,
      });

      const createdVenue = new Venue({
        stringAddress,
        region,
        district,
        mop,
        momc,
        company,
        location: { type: 'Point', coordinates },
      });

      await createdVenue.save();

      ctx.body = {
        success: true,
        data: createdVenue,
      };
    },
  ],
});

export default router;
