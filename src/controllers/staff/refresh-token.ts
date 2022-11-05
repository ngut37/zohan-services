import joiRouter from 'koa-joi-router';

import { ObjectId } from 'mongodb';

import { Staff } from '@models/staff';
import { validateCompanyRefreshToken } from '@utils/company-auth';

const router = joiRouter();

router.route({
  path: '/refresh-token',
  method: 'get',
  handler: [
    async (ctx) => {
      const refreshToken = ctx.cookies.get('refresh_token');
      if (!refreshToken) {
        return ctx.throw(401);
      }

      // validate and extract refresh token payload
      const refreshTokenPayload = validateCompanyRefreshToken(refreshToken);
      if (!refreshTokenPayload) {
        return ctx.throw(401);
      }

      // compare access and refresh token userId
      const { staffId: refreshStaffId } = refreshTokenPayload;

      // check if user exists
      const staff = await Staff.findOne({
        _id: new ObjectId(refreshStaffId),
      });
      if (!staff) {
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
