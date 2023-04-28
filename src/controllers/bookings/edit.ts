import { ObjectId } from 'mongodb';
import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { Booking, BookingAttributes } from '@models/booking';
import { Venue } from '@models/venue';
import { Staff } from '@models/staff';
import { Service } from '@models/service';
import { differenceInMinutes } from 'date-fns';

const router = joiRouter();

type RequestParams = {
  id: string;
};

type RequestBody = {
  venueId?: string;
  staffId?: string;
  serviceId?: string;
  start?: string;
  end?: string;
  customCustomer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  existingCustomer?: string;
};

const requestParamsSchema = {
  id: Joi.string().hex().length(24).required(),
};

const requestBodySchema = {
  venueId: Joi.string().hex().length(24).optional(),
  staffId: Joi.string().hex().length(24).optional(),
  serviceId: Joi.string().hex().length(24).optional(),
  start: Joi.string().isoDate().optional(),
  end: Joi.string().isoDate().optional(),
  customCustomer: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional().allow(''),
    phone: Joi.string().optional().allow(''),
  }).optional(),
  existingCustomer: Joi.string().hex().length(24).optional(),
};

router.route({
  method: 'put',
  path: '/:id',
  validate: {
    type: 'json',
    body: requestBodySchema,
    params: requestParamsSchema,
  },
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
      allowedRoles: ['admin', 'editor'],
    }),
    async (ctx) => {
      const params = ctx.request.params as RequestParams;
      const { id } = params;

      // validate booking exists
      const booking = await Booking.findById(id);
      if (!booking) {
        ctx.throw(404, `Booking with ID "${id}" not found.`);
        return;
      }

      const { venueId, staffId, serviceId, start, end, customCustomer } = ctx
        .request.body as RequestBody;

      const service = await Service.findById(serviceId || booking.service);
      if (!service) {
        ctx.throw(400, `Service with ID "${serviceId}" not found.`);
        return;
      }

      if (venueId !== booking.venue.toString()) {
        // validate venue exists
        const venue = await Venue.findById(venueId);
        if (!venue) {
          ctx.throw(400, `Venue with ID "${venueId}" not found.`);
          return;
        }

        booking.venue = new ObjectId(venueId);
      }

      if (staffId !== booking.staff.toString()) {
        // validate staff exists
        const staff = await Staff.findById(staffId);
        if (!staff) {
          ctx.throw(400, `Staff with ID "${staffId}" not found.`);
          return;
        }

        booking.staff = new ObjectId(staffId);
      }

      if (start) {
        booking.start = new Date(start);
      }

      if (end) {
        booking.end = new Date(end);
      }

      if (serviceId) {
        // validate booking duration is valid with service length
        const serviceLengthInMinutes = service.length;
        const diffInMinutes = differenceInMinutes(booking.end, booking.start);
        if (diffInMinutes !== serviceLengthInMinutes) {
          ctx.throw(
            400,
            `Booking duration must be ${serviceLengthInMinutes} minutes.`,
          );
          return;
        }

        booking.service = new ObjectId(serviceId);
      }

      if (Object.keys(customCustomer || {}).length > 0) {
        booking.set('existingCustomer', null);

        booking.customCustomer = {
          ...booking.customCustomer,
          ...customCustomer,
        } as BookingAttributes['customCustomer'];
      }

      await booking.save();

      ctx.body = {
        success: true,
        data: { ...booking.toObject() },
      };
    },
  ],
});

export default router;
