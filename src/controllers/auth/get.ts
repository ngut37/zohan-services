import { ParameterizedContext } from 'koa';
import joiRouter from 'koa-joi-router';

import { protectRouteMiddleware } from 'controllers/middlewares/access-token';
import { ExtendedAccessTokenPayload } from '@utils/auth';

const router = joiRouter();

router.route({
  path: '/get',
  method: 'get',
  // validate: {
  //   type: 'json',
  // },
  handler: [
    protectRouteMiddleware({ allowedRoles: ['service_admin'] }),
    async (ctx: ParameterizedContext) => {
      const user = ctx.state.auth as ExtendedAccessTokenPayload;
      console.log({ user });
      ctx.body = {
        success: true,
        data: 'Mam v pici',
      };
    },
  ],
});

export default router;
