import joiRouter from 'koa-joi-router';

import {
  CompleteCompanyAccessTokenPayload,
  validateCompanyRefreshToken,
} from '@utils/company-auth';
import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

const router = joiRouter();

router.route({
  path: '/refresh-token',
  method: 'get',
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: true,
    }),
    async (ctx) => {
      const refreshToken = ctx.cookies.get('refresh_token');
      if (!refreshToken || !ctx.state.auth) {
        return ctx.throw(401);
      }

      // validate and extract refresh token payload
      const refreshTokenPayload = validateCompanyRefreshToken(refreshToken);
      if (!refreshTokenPayload) {
        return ctx.throw(401);
      }

      // parse staff document from middleware result
      const { staff } = ctx.state.auth as CompleteCompanyAccessTokenPayload;
      const { staffId: refreshStaffId } = refreshTokenPayload;

      if (!staff || staff.id !== refreshStaffId) {
        return ctx.throw(401);
      }

      // generate new access token
      const newAccessToken = staff.generateAccessToken();

      ctx.body = {
        success: true,
        data: { accessToken: newAccessToken },
      };
    },
  ],
});

export default router;
