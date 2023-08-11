import joiRouter from 'koa-joi-router';

import { CompleteAccessTokenPayload, validateRefreshToken } from '@utils/auth';

import { protectRouteMiddleware } from '@middlewares/protect';

const router = joiRouter();

router.route({
  path: '/refresh-token',
  method: 'get',
  handler: [
    protectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const refreshToken = ctx.cookies.get('refresh_token');
      if (!refreshToken) {
        return ctx.throw(401);
      }

      // validate and extract refresh token payload
      const refreshTokenPayload = validateRefreshToken(refreshToken);
      if (!refreshTokenPayload) {
        return ctx.throw(401);
      }

      // parse staff document from middleware result
      const { user } = ctx.state.auth as CompleteAccessTokenPayload;
      const { id: refreshUserId } = refreshTokenPayload;

      if (!user.id || user.id !== refreshUserId) {
        return ctx.throw(401);
      }

      // generate new access token
      const newAccessToken = user.generateAccessToken();

      ctx.body = {
        success: true,
        data: { accessToken: newAccessToken },
      };
    },
  ],
});

export default router;
