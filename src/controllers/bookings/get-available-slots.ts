import joiRouter, { Joi } from 'koa-joi-router';
import { toZonedTime } from 'date-fns-tz';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { protectRouteMiddleware } from '@middlewares/protect';

import { Venue } from '@models/venue';
import { Booking } from '@models/booking';
import { Service } from '@models/service';
import { endOfDay, startOfDay } from 'date-fns';
import { getAvailableSlots } from '@utils/bookings/get-available-slots';
import { Staff } from '@models/staff';

const router = joiRouter();

type RequestQuery = {
  venueId: string;
  serviceId: string;
  staffId: string;
  day: string;
};

const requestQuerySchema = {
  venueId: Joi.string().hex().length(24).required(),
  serviceId: Joi.string().hex().length(24).required(),
  staffId: Joi.string().hex().length(24).required(),
  day: Joi.string().isoDate().required(),
};

router.route({
  path: '/available-slots',
  method: 'get',
  validate: {
    query: requestQuerySchema,
  },
  handler: [
    protectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { venueId, serviceId, staffId, day } = ctx.request
        .query as RequestQuery;

      const venue = await Venue.findById(venueId);

      if (!venue) {
        return ctx.throw(404, 'Venue not found');
      }

      const service = await Service.findById(serviceId);

      if (!service) {
        return ctx.throw(404, 'Service not found');
      }

      if (service.venue.toString() !== venueId) {
        return ctx.throw(400, 'Service does not belong to venue');
      }

      const staff = await Staff.findById(staffId);

      if (!staff) {
        return ctx.throw(404, 'Staff not found');
      }

      const zonedTime = toZonedTime(
        day,
        config.get(CONFIG_KEYS.DATE_FNZ_TIMEZONE),
      );

      const start = startOfDay(zonedTime);
      const end = endOfDay(zonedTime);

      const bookings = await Booking.find({
        venue: venueId,
        staff: staffId,
        start: { $gte: start },
        end: { $lte: end },
        cancelledAt: { $exists: false },
      });

      const availableBookingSlots = getAvailableSlots({
        zonedTime,
        service,
        venue,
        bookings,
      });

      ctx.body = {
        success: true,
        data: availableBookingSlots,
      };
    },
  ],
});

export default router;
