import { ObjectId } from 'mongodb';
import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { Venue } from '@models/venue';
import { Staff } from '@models/staff';
import { Booking } from '@models/booking';

const router = joiRouter();

type RequestParams = {
  id: string;
};

const requestParamsSchema = {
  id: Joi.string().hex().length(24).required(),
};

router.route({
  method: 'delete',
  path: '/:id',
  validate: {
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

      // Check if venue exists
      const venue = await Venue.findOne({
        _id: new ObjectId(id),
      });

      if (!venue) {
        return ctx.throw(404, 'Venue not found');
      }

      // Unset all staff members related to the venue
      await Staff.updateMany({ venue: venue._id }, { $unset: { venue: 1 } });

      // Delete all bookings associated with the venue
      await Booking.deleteMany({
        venue: venue._id,
      });

      // Delete the venue
      await Venue.deleteOne({
        _id: venue._id,
      });

      return (ctx.status = 204);
    },
  ],
});

export default router;
