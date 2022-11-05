import joiRouter from 'koa-joi-router';

const router = joiRouter();

router.route({
  path: '/logout',
  method: 'post',
  handler: [
    async (ctx) => {
      ctx.cookies.set('access_token', '', { httpOnly: true });
      ctx.cookies.set('refresh_token', '', { httpOnly: true });

      ctx.body = {
        success: true,
      };
    },
  ],
});

export default router;
