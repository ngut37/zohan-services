import joiRouter from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { Staff } from '@models/staff';

import { CompanyAccessTokenPayload } from '@utils/company-auth';

const router = joiRouter();

router.route({
  path: '/',
  method: 'get',
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
      allowedRoles: ['admin', 'editor'],
    }),
    async (ctx) => {
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      const fetchedStaffByCompanyId = await Staff.find(
        { company },
        {
          id: 1,
          name: 1,
          email: 1,
          role: 1,
          venues: 1,
        },
        { sort: { createdAt: -1 } }, // DESC sort
      ).populate('venues');

      ctx.body = {
        success: true,
        data: { staff: fetchedStaffByCompanyId },
      };
    },
  ],
});

export default router;
