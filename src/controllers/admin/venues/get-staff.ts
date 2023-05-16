import joiRouter from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { CompanyAccessTokenPayload } from '@utils/company-auth';

import { Staff } from '@models/staff';

const router = joiRouter();

type RequestParams = {
  id: string;
};

router.route({
  path: '/:id/staff',
  method: 'get',
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { id } = ctx.request.params as RequestParams;
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      const fetchedStaff = await Staff.find({
        venue: id,
        company,
      }).lean();

      ctx.body = {
        success: true,
        data: fetchedStaff,
      };
    },
  ],
});

export default router;
