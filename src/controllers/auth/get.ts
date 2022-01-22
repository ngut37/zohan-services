import { ParameterizedContext } from 'koa';
import joiRouter from 'koa-joi-router';

import { protectRouteMiddleware } from 'controllers/middlewares/access-token';
import { ExtendedAccessTokenPayload } from '@utils/auth';
import { User } from '@models/users/user';

const router = joiRouter();

router.route({
  path: '/',
  method: 'get',
  handler: [
    protectRouteMiddleware({ allowUnauthorized: false }),
    async (ctx: ParameterizedContext) => {
      const authUser = ctx.state.auth as ExtendedAccessTokenPayload;
      const user = await User.findById(authUser.userId, { password: 0 });

      ctx.body = {
        success: true,
        data: user,
      };
    },
  ],
});

export default router;
