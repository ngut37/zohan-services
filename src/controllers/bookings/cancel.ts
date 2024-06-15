import joiRouter, { Joi } from 'koa-joi-router';

import { protectRouteMiddleware } from '@middlewares/protect';

import { CompleteAccessTokenPayload } from '@utils/auth/user-auth';

import { Booking } from '@models/booking';

const router = joiRouter();

type RequestParams = {
  id: string;
};

const requestParamsSchema = {
  id: Joi.string().hex().length(24).required(),
};

router.route({
  path: '/:id/cancel',
  method: 'post',
  validate: {
    params: requestParamsSchema,
  },
  handler: [
    protectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { id: userId } = ctx.state.auth as CompleteAccessTokenPayload;

      const params = ctx.request.params as RequestParams;
      const { id } = params;

      // find booking
      const booking = await Booking.findById(id);

      if (!booking) {
        return ctx.throw(400, `Booking with ID "${id}" not found.`);
      }

      const leanBooking = booking.toObject();
      if (leanBooking.customCustomer) {
        return ctx.throw(
          403,
          `Booking with ID "${id}" cannot be cancelled because it was made for a custom customer.`,
        );
      }

      if (
        leanBooking.existingCustomer &&
        leanBooking.existingCustomer.toString() !== userId
      ) {
        ctx.throw(403, `You are not allowed to cancel this booking.`);
      }

      if (leanBooking.cancelledAt) {
        ctx.status = 200;
        ctx.body = {
          success: true,
        };
        return;
      }

      booking.cancelledAt = new Date();
      await booking.save();

      ctx.status = 200;
      ctx.body = {
        success: true,
      };
    },
  ],
});

export default router;
