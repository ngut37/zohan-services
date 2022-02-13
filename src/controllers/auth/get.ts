import { ParameterizedContext } from 'koa';
import joiRouter from 'koa-joi-router';

import { User } from '@models/user';

import { AccessTokenPayload } from '@utils/auth';

import { protectRouteMiddleware } from '@middlewares/access-token';

const router = joiRouter();

router.route({
  path: '/',
  method: 'get',
  handler: [
    protectRouteMiddleware({ allowUnauthorized: false }),
    async (ctx: ParameterizedContext) => {
      const authUser = ctx.state.auth as AccessTokenPayload;
      const user = await User.findById(authUser.id, { password: 0 });

      ctx.body = {
        success: true,
        data: user,
      };
    },
  ],
});

export default router;
