import joiRouter from 'koa-joi-router';

import { protectRouteMiddleware } from '@middlewares/protect';

import { AccessTokenPayload } from '@utils/auth/user-auth';

import { Venue } from '@models/venue';
import { Booking } from '@models/booking';
import { Service } from '@models/service';
import { Staff } from '@models/staff';
import { Company } from '@models/company';
import { District } from '@models/district';
import { Momc } from '@models/momc';

const router = joiRouter();

router.route({
  path: '/get-active',
  method: 'get',
  handler: [
    protectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { id: userId } = ctx.state.auth as AccessTokenPayload;

      const now = new Date();

      // get user's bookings that are in future
      const bookings = await Booking.find({
        existingCustomer: userId,
        start: {
          $gte: now,
        },
        cancelledAt: { $exists: false },
      }).populate<{
        venue: Venue & { company: Company; district: District; momc: Momc };
        staff?: Staff;
        service: Service;
      }>([
        { path: 'venue', populate: { path: 'company' } },
        { path: 'venue', populate: { path: 'district' } },
        { path: 'venue', populate: { path: 'momc' } },
        'staff',
        'service',
      ]);

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
            staffName: staff?.name,
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
      };
    },
  ],
});

export default router;
