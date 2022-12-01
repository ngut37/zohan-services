import joiRouter from 'koa-joi-router';

import { User } from '@models/user';

import { AccessTokenPayload } from '@utils/auth';

import { protectRouteMiddleware } from '@middlewares/protect';

const router = joiRouter();

router.route({
  path: '/',
  method: 'get',
  handler: [
    protectRouteMiddleware({ allowUnauthorized: false }),
    async (ctx) => {
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
