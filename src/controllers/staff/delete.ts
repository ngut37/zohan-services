import { ObjectId } from 'mongodb';
import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { Staff } from '@models/staff';
import { Booking } from '@models/booking';
import { CompanyAccessTokenPayload } from '@utils/company-auth';

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
      allowedRoles: ['admin'],
    }),
    async (ctx) => {
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;
      const params = ctx.request.params as RequestParams;
      const { id } = params;

      // Check if staff is deleting themselves
      if (id === ctx.state.auth.id) {
        return ctx.throw(400, 'You cannot delete yourself');
      }

      // Check if staff member exists for the company from access token
      const staff = await Staff.findOne({
        _id: new ObjectId(id),
        company,
      });

      if (!staff) {
        return ctx.throw(404, 'Staff member not found');
      }

      // Delete the staff member
      await Staff.deleteOne({
        _id: staff._id,
      });

      // Delete all bookings associated with the staff member
      await Booking.deleteMany({
        staff: staff._id,
      });

      return (ctx.status = 204);
    },
  ],
});

export default router;
