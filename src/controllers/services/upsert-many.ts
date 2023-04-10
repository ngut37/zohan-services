import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';
import { CompanyAccessTokenPayload } from '@utils/company-auth';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { Venue } from '@models/venue';
import {
  ServiceName,
  ServiceType,
  SERVICE_NAMES,
  SERVICE_TYPES,
} from '@models/service';
import { Service } from '@models/service';

const router = joiRouter();

type RequestBody = {
  services: {
    id?: string;
    type: ServiceType;
    name: ServiceName;
    venue: string;
    staff: string[];
    length: number;
    price: number;
  }[];
};

const requestBodySchema = {
  services: Joi.array()
    .items({
      id: Joi.string().hex().length(24),
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
    })
    .required(),
};

router.route({
  path: '/upsert-many',
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

      const { services } = body;

      if (services.length === 0) {
        // skipping empty array
        return;
      }

      const venue = services[0].venue;

      // get venue and check if it belongs to the company of the staff
      const foundVenue = await Venue.findOne({
        _id: venue,
        company,
      });

      if (!foundVenue) {
        ctx.throw(400, `Venue with ID ${venue} not found`);
        return;
      }

      /**
       * To save on upsert DB operations,
       * check if service already has ID:
       * - it does -> update it
       * - if not -> upsert it
       */
      const bulkOperations = services.map((service) => {
        if (service.id) {
          return {
            updateOne: {
              filter: { _id: service.id },
              update: {
                $set: {
                  type: service.type,
                  name: service.name,
                  venue: service.venue,
                  staff: service.staff,
                  length: service.length,
                  price: service.price,
                },
              },
            },
          };
        }

        return {
          updateOne: {
            filter: {
              type: service.type,
              name: service.name,
              venue: service.venue,
            },
            update: {
              $set: {
                type: service.type,
                name: service.name,
                venue: service.venue,
                staff: service.staff,
                length: service.length,
                price: service.price,
              },
            },
            upsert: true,
          },
        };
      });

      await Service.bulkWrite(bulkOperations);

      ctx.body = {
        success: true,
      };
    },
  ],
});

export default router;
