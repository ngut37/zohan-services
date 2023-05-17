import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';
import { CompanyAccessTokenPayload } from '@utils/company-auth';

import { Venue } from '@models/venue';
import { Booking } from '@models/booking';
import { Service } from '@models/service';
import { User } from '@models/user';

const router = joiRouter();

type RequestQuery = {
  venueId: string;
  start: string;
  end: string;
};

const requestQuerySchema = {
  venueId: Joi.string().hex().length(24).required(),
  start: Joi.string().isoDate().required(),
  end: Joi.string().isoDate().required(),
};

router.route({
  path: '/',
  method: 'get',
  validate: {
    query: requestQuerySchema,
  },
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { venueId, start, end } = ctx.request.query as RequestQuery;
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      // validate that start is before end
      if (new Date(start) > new Date(end)) {
        return ctx.throw(400, 'Start date must be before end date');
      }

      const bookings = await Booking.find({
        venue: venueId,
        start: { $gte: start },
        end: { $lte: end },
      }).populate<{ venue: Venue; service: Service; existingCustomer?: User }>([
        'venue',
        'service',
        'existingCustomer',
      ]);

      if (!bookings.length) {
        return (ctx.body = {
          success: true,
          data: [],
        });
      }

      // should be the same venue for all bookings
      const venue = bookings[0].venue;

      if (venue.company.toString() !== company) {
        return ctx.throw(403, 'Forbidden');
      }

      /**
       * Map booking to depopulate venue
       * and remove private fields in existingCustomer
       */

      const bookingsWithDepopulatedVenue = bookings.map((booking) => {
        booking.depopulate('venue');

        const objectifiedBooking = booking.toObject<any>();

        if (booking.existingCustomer) {
          objectifiedBooking.existingCustomer = {
            id: booking.existingCustomer._id,
            name: booking.existingCustomer.name,
            email: booking.existingCustomer.email,
          };
        }

        return objectifiedBooking;
      });

      ctx.body = {
        success: true,
        data: bookingsWithDepopulatedVenue,
      };
    },
  ],
});

export default router;
