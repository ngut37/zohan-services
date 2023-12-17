import joiRouter, { Joi } from 'koa-joi-router';

import { User } from '@models/user';

import {
  AccessTokenPayload,
  validateRefreshToken,
} from '@utils/auth/user-auth';
import { formatPhoneNumber } from '@utils/phone-number';

import { protectRouteMiddleware } from '@middlewares/protect';

const router = joiRouter();

type RequestBody = {
  name?: string;
  email?: string;
  phoneNumber?: string;
};

const requestBodySchema = {
  name: Joi.string(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
};

router.route({
  path: '/update',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    protectRouteMiddleware({ allowUnauthorized: false }),
    async (ctx) => {
      const { phoneNumber, ...modifications } = ctx.request.body as RequestBody;
      const { id: userId } = ctx.state.auth as AccessTokenPayload;
      const refreshToken = ctx.cookies.get('refresh_token');

      if (!refreshToken) {
        return ctx.throw(401, 'Unauthorized.');
      }

      const refreshTokenPayload = validateRefreshToken(refreshToken);

      if (!refreshTokenPayload) {
        return ctx.throw(401, 'Unauthorized.');
      }

      if (userId !== refreshTokenPayload.id) {
        return ctx.throw(401, 'Unauthorized.');
      }

      const user = await User.findById(userId, { password: 0 });
      if (!user) {
        return ctx.throw(404, `User not found with ID ${userId}`);
      }

      if (phoneNumber) {
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        user.phoneNumber = formattedPhoneNumber;
      }

      user.set(modifications);

      await user.save();

      // generate new access token
      const accessToken = user.generateAccessToken();

      ctx.body = {
        success: true,
        data: { accessToken },
      };
    },
  ],
});

export default router;
