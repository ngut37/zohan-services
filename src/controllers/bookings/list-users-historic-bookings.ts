import joiRouter from 'koa-joi-router';

import { protectRouteMiddleware } from '@middlewares/protect';

import { AccessTokenPayload } from '@utils/auth/user-auth';
import { PaginationQuery, paginationQuerySchema } from '@utils/pagination';

import { Venue } from '@models/venue';
import { Booking } from '@models/booking';
import { Service } from '@models/service';
import { Staff } from '@models/staff';
import { Company } from '@models/company';
import { District } from '@models/district';
import { Momc } from '@models/momc';

const router = joiRouter();

type RequestQuery = PaginationQuery;

const requestQuerySchema = paginationQuerySchema;

router.route({
  path: '/list-historic',
  method: 'get',
  validate: {
    query: requestQuerySchema,
  },
  handler: [
    protectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { id: userId } = ctx.state.auth as AccessTokenPayload;
      const query = ctx.request.query as RequestQuery;

      const { page: pageString, limit: limitString } = query;
      const page = parseInt(pageString, 10);
      const limit = parseInt(limitString, 10);

      const now = new Date();

      // get user's bookings that are in past
      const bookings = await Booking.find({
        existingCustomer: userId,
        start: {
          $lt: now,
        },
      })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate<{
          venue: Venue & { company: Company; district: District; momc: Momc };
          staff: Staff;
          service: Service;
        }>([
          { path: 'venue', populate: { path: 'company' } },
          { path: 'venue', populate: { path: 'district' } },
          { path: 'venue', populate: { path: 'momc' } },
          'staff',
          'service',
        ]);

      const count = await Booking.countDocuments({
        existingCustomer: userId,
        start: {
          $lt: now,
        },
      });

      // custom projection
      const bookingsWithCustomProjection = bookings.map((booking) => {
        const { venue, staff, service, start, end } = booking;

        return {
          _id: booking._id,
          venue: {
            _id: venue._id,
            company: venue.company.name,
            stringAddress: venue.stringAddress,
            district: venue.district.name,
            momc: venue.momc?.name,
          },
          staff: {
            staffName: staff.name,
          },
          service: {
            name: service.name,
            type: service.type,
            price: service.price,
          },
          start,
          end,
        };
      });

      ctx.body = {
        success: true,
        data: bookingsWithCustomProjection,
        pagination: {
          page,
          limit,
          total: count,
        },
      };
    },
  ],
});

export default router;
