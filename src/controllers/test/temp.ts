import joiRouter from 'koa-joi-router';

const router = joiRouter();

router.route({
  path: '/veriff',
  method: 'post',
  handler: [
    (ctx) => {
      console.log(ctx);

      ctx.status = 200;
      return;
    },
  ],
});

export default router;
