import joiRouter from 'koa-joi-router';
import { ParameterizedContext } from 'koa';
import { ObjectId } from 'mongodb';

import { validateAccessToken, validateRefreshToken } from '@utils/auth';
import { User } from '@models/users/user';

const router = joiRouter();

router.route({
  path: '/me',
  method: 'get',
  handler: [
    async (ctx: ParameterizedContext) => {
      const accessToken = ctx.cookies.get('access_token');
      const refreshToken = ctx.cookies.get('refresh_token');
      if (!accessToken || !refreshToken) {
        return ctx.throw(401);
      }
      // validate and extract access token payload
      const accessTokenPayload = validateAccessToken(accessToken, {
        ignoreExpiration: true,
      });
      if (!accessTokenPayload) {
        return ctx.throw(401);
      }

      // validate and extract refresh token payload
      const refreshTokenPayload = validateRefreshToken(refreshToken);
      if (!refreshTokenPayload) {
        return ctx.throw(401);
      }

      // compare access and refresh token userId
      const { userId: accessUserId } = accessTokenPayload;
      const { userId: refreshUserId } = refreshTokenPayload;
      if (accessUserId !== refreshUserId) {
        return ctx.throw(401);
      }

      // check if user exists
      const user = await User.findOne({
        _id: new ObjectId(accessUserId),
      });
      if (!user) {
        return ctx.throw(401);
      }

      // generate new access token
      const newAccessToken = user.generateAccessToken();

      const { password: _pw, ...publicUser } = user.toObject();

      ctx.cookies.set('access_token', newAccessToken, { httpOnly: true });

      ctx.body = {
        success: true,
        data: { tokenPayload: accessTokenPayload, user: publicUser },
      };
    },
  ],
});

export default router;
