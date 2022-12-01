import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';
import { Venue } from '@models/venue';

import { mapLocationToIds } from '../utils/map-location-to-ids';

const router = joiRouter();

type RequestParams = {
  id: string;
};

type RequestBody = {
  stringAddress: string;

  regionString: string;
  districtString: string;
  quarterString?: string; // momc
  coordinates: [number, number]; // momc
};

const requestBodySchema = {
  stringAddress: Joi.string().required(),

  regionString: Joi.string().required(),
  districtString: Joi.string().required(),
  quarterString: Joi.string().allow(''), // momc
  coordinates: Joi.array().items(Joi.number()).length(2).required(), // momc
};

router.route({
  path: '/:id/edit',
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
      const { id } = ctx.request.params as RequestParams;
      const body = ctx.request.body as RequestBody;

      const {
        stringAddress,
        regionString,
        districtString,
        quarterString,
        coordinates,
      } = body;

      const foundVenue = await Venue.findById(id);

      if (!foundVenue) {
        return ctx.throw(404, `Venue with ID "${id}" was not found.`);
      }

      const { region, district, mop, momc } = await mapLocationToIds({
        regionString,
        districtString,
        quarterString,
        ctx,
      });

      foundVenue.stringAddress = stringAddress;
      foundVenue.region = region;
      foundVenue.district = district;
      foundVenue.mop = mop;
      foundVenue.momc = momc;
      foundVenue.location.coordinates = coordinates;

      await foundVenue.save();

      ctx.body = {
        success: true,
        data: { foundVenue },
      };
    },
  ],
});

export default router;
