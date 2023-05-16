import { ObjectId } from 'mongodb';
import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { Booking, BookingAttributes } from '@models/booking';
import { Venue } from '@models/venue';
import { Staff } from '@models/staff';
import { Service } from '@models/service';
import { differenceInMinutes } from 'date-fns';

const router = joiRouter();

type RequestBody = {
  venueId: string;
  staffId: string;
  serviceId: string;
  start: string;
  end: string;
  customCustomer: {
    name: string;
    email?: string;
    phone?: string;
  };
};

const requestBodySchema = {
  venueId: Joi.string().hex().length(24).required(),
  staffId: Joi.string().hex().length(24).required(),
  serviceId: Joi.string().hex().length(24).required(),
  start: Joi.string().isoDate().required(),
  end: Joi.string().isoDate().required(),
  customCustomer: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().optional().allow(''),
    phone: Joi.string().optional().allow(''),
  }).required(),
};

router.route({
  path: '/',
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
      // body
      const body = ctx.request.body as RequestBody;
      const { venueId, staffId, serviceId, start, end, customCustomer } = body;

      // validate venue exists
      const venue = await Venue.findById(venueId).lean();
      if (!venue) {
        ctx.throw(400, `Venue with ID "${venueId}" not found.`);
        return;
      }

      // validate staff exists
      const staff = await Staff.findById(staffId).lean();
      if (!staff) {
        ctx.throw(400, `Staff with ID "${staffId}" not found.`);
        return;
      }

      // validate service exists
      const service = await Service.findById(serviceId).lean();
      if (!service) {
        ctx.throw(400, `Service with ID "${serviceId}" not found.`);
        return;
      }

      // validate start and end
      if (new Date(start) >= new Date(end)) {
        ctx.throw(400, 'Start date must be before end date.');
        return;
      }

      // validate booking duration is valid with service length
      const startDate = new Date(start);
      const endDate = new Date(end);
      const serviceLengthInMinutes = service.length;
      const diffInMinutes = differenceInMinutes(endDate, startDate);
      if (diffInMinutes !== serviceLengthInMinutes) {
        ctx.throw(
          400,
          `Booking duration must be ${serviceLengthInMinutes} minutes.`,
        );
        return;
      }

      const bookingAttributes: Omit<BookingAttributes, '_id'> = {
        venue: new ObjectId(venueId),
        staff: new ObjectId(staffId),
        service: new ObjectId(serviceId),
        start: new Date(start),
        end: new Date(end),
        customCustomer,
      };

      const createdBooking = new Booking(bookingAttributes);

      await createdBooking.save();

      ctx.body = {
        success: true,
        data: { ...createdBooking.toObject() },
      };
    },
  ],
});

export default router;
