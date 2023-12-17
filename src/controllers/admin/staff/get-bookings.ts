import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { Staff } from '@models/staff';
import { CompanyAccessTokenPayload } from '@utils/auth/company-auth';
import { Booking } from '@models/booking';

const router = joiRouter();

type RequestParams = {
  id: string;
};

type RequestQuery = {
  start: string;
  end: string;
};

const requestParamsSchema = {
  id: Joi.string().hex().length(24).required(),
};

const requestQuerySchema = {
  start: Joi.string().isoDate().required(),
  end: Joi.string().isoDate().required(),
};

router.route({
  path: '/:id/bookings',
  method: 'get',
  validate: {
    params: requestParamsSchema,
    query: requestQuerySchema,
  },

  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;
      const { id: staffId } = ctx.request.params as RequestParams;
      const { start, end } = ctx.request.query as RequestQuery;

      const [foundStaff] = await Staff.find({ _id: staffId, company });

      if (!foundStaff) {
        return ctx.throw(404, `Staff with ID "${staffId}" was not found.`);
      }

      const bookings = await Booking.find({
        staff: staffId,
        start: { $gte: start },
        end: { $lte: end },
      });

      ctx.body = {
        success: true,
        data: bookings,
      };
    },
  ],
});

export default router;
