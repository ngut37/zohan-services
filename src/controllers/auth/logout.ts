import joiRouter from 'koa-joi-router';
import { ParameterizedContext } from 'koa';

const router = joiRouter();

router.route({
  path: '/logout',
  method: 'post',
  handler: [
    async (ctx: ParameterizedContext) => {
      ctx.cookies.set('access_token', '', { httpOnly: true });
      ctx.cookies.set('refresh_token', '', { httpOnly: true });

      ctx.body = {
        success: true,
      };
    },
  ],
});

export default router;
