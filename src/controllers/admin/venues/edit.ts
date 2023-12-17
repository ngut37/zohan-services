import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { CompanyAccessTokenPayload } from '@utils/auth/company-auth';

import { Venue, WeeklyBusinessHours } from '@models/venue';
import { Coordinates } from '@models/types';

import { validateBusinessHours } from '../../utils/validate-business-hours';
import { mapLocationToIds } from '../../utils/map-location-to-ids';

const router = joiRouter();

type RequestParams = {
  id: string;
};

type RequestBody = {
  stringAddress: string;

  regionString: string;
  districtString: string;
  quarterString?: string; // momc
  coordinates: Coordinates; // momc

  businessHours: WeeklyBusinessHours;
};

const businessHoursJoiSchema = Joi.object({
  openingTime: Joi.object({
    hour: Joi.number().min(0).max(23).required(),
    minute: Joi.number().min(0).max(59).required(),
  }).required(),
  closingTime: Joi.object({
    hour: Joi.number().min(0).max(23).required(),
    minute: Joi.number().min(0).max(59).required(),
  }).required(),
});

const requestBodySchema = {
  stringAddress: Joi.string().required(),

  regionString: Joi.string().required(),
  districtString: Joi.string().required(),
  quarterString: Joi.string().allow(''), // momc
  coordinates: Joi.array().items(Joi.number()).length(2).required(), // momc

  businessHours: Joi.object({
    mon: businessHoursJoiSchema,
    tue: businessHoursJoiSchema,
    wed: businessHoursJoiSchema,
    thu: businessHoursJoiSchema,
    fri: businessHoursJoiSchema,
    sat: businessHoursJoiSchema,
    sun: businessHoursJoiSchema,
  }).required(),
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
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      const {
        stringAddress,
        regionString,
        districtString,
        quarterString,
        coordinates,
        businessHours,
      } = body;

      try {
        validateBusinessHours(businessHours);
      } catch (error) {
        return ctx.throw(400, error.message);
      }

      const [foundVenueToUpdate] = await Venue.find({ _id: id, company });

      if (!foundVenueToUpdate) {
        return ctx.throw(404, `Venue with ID "${id}" was not found.`);
      }

      const { region, district, mop, momc } = await mapLocationToIds({
        regionString,
        districtString,
        quarterString,
        ctx,
      });

      foundVenueToUpdate.stringAddress = stringAddress;
      foundVenueToUpdate.region = region;
      foundVenueToUpdate.district = district;
      foundVenueToUpdate.mop = mop;
      foundVenueToUpdate.momc = momc;
      foundVenueToUpdate.location.coordinates = coordinates;
      foundVenueToUpdate.businessHours = businessHours;

      await foundVenueToUpdate.save();

      ctx.body = {
        success: true,
        data: { foundVenue: foundVenueToUpdate },
      };
    },
  ],
});

export default router;
