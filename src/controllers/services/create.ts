import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';
import { Venue } from '@models/venue';
import { CompanyAccessTokenPayload } from '@utils/company-auth';

import {
  ServiceName,
  ServiceType,
  SERVICE_NAMES,
  SERVICE_TYPES,
} from '@models/service';
import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';
import { Service } from '@models/service';

const router = joiRouter();

type RequestBody = {
  type: ServiceType;
  name: ServiceName;
  venue: string;
  staff: string[];
  length: number;
  price: number;
};

const requestBodySchema = {
  type: Joi.string()
    .valid(...Object.keys(SERVICE_TYPES))
    .required(),
  name: Joi.string()
    .valid(...Object.keys(SERVICE_NAMES))
    .required(),
  venue: Joi.string().hex().length(24),
  staff: Joi.array().items(Joi.string().hex().length(24)).required(),
  length: Joi.number()
    .integer()
    .positive()
    .multiple(config.get(CONFIG_KEYS.SERVICE_LENGTH_CHUNK_SIZE_IN_MINUTES)),
  price: Joi.number().integer().positive(),
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

      const { type, name, venue, staff, length, price } = body;

      // get venue and check if it belongs to the company of the staff
      const foundVenue = await Venue.findOne({
        _id: venue,
        company,
      });

      if (!foundVenue) {
        ctx.throw(400, `Venue with ID ${venue} not found`);
        return;
      }

      const createdService = new Service({
        type,
        name,
        venue,
        staff,
        length,
        price,
      });

      await createdService.save();

      ctx.body = {
        success: true,
        data: { createdService },
      };
    },
  ],
});

export default router;
