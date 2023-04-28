import { ObjectId } from 'mongodb';
import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

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

      await Booking.deleteOne({
        _id: new ObjectId(id),
      });

      return (ctx.status = 204);
    },
  ],
});

export default router;
