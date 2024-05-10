import joiRouter, { Joi } from 'koa-joi-router';

import { User, USER_STATUS } from '@models/user';

import {
  AccessTokenPayload,
  validateRefreshToken,
} from '@utils/auth/user-auth';
import { formatPhoneNumber } from '@utils/phone-number';
import * as mailer from '@utils/mailer';
import { generateEmailRegex } from '@utils/email';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

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
      const { phoneNumber, email, ...modifications } = ctx.request
        .body as RequestBody;
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

      if (email && user.email !== email) {
        const emailRegex = generateEmailRegex(email);

        const userExists = await User.exists({ email: { $regex: emailRegex } });

        if (userExists) {
          return ctx.throw(409, 'This email has already been used.');
        }

        user.set({ email, status: USER_STATUS.not_verified });
        await user.save();

        const userEmailVerificationToken =
          user.generateEmailVerificationToken();

        await mailer.sendVerificationEmailForCustomer({
          to: user.email,
          verificationLink: `${config.get(
            CONFIG_KEYS.APP_URL,
          )}/auth/verify-email?token=${userEmailVerificationToken}`,
        });

        ctx.cookies.set('refresh_token', '', { httpOnly: true });

        ctx.body = {
          success: true,
          data: { accessToken: null },
        };
        return;
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
