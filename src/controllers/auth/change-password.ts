import joiRouter, { Joi } from 'koa-joi-router';

import { User } from '@models/user';

import { AccessTokenPayload, validateRefreshToken } from '@utils/auth';

import { protectRouteMiddleware } from '@middlewares/protect';

const router = joiRouter();

type RequestBody = {
  oldPassword: string;
  newPassword: string;
};

const requestBodySchema = {
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
};

router.route({
  path: '/change-password',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    protectRouteMiddleware({ allowUnauthorized: false }),
    async (ctx) => {
      const { oldPassword, newPassword } = ctx.request.body as RequestBody;
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

      const user = await User.findOne({
        _id: userId,
      });
      if (!user) {
        return ctx.throw(401, 'User does not exist.');
      }

      const isValidPassword = await user.validatePassword(oldPassword);
      if (!isValidPassword) {
        return ctx.throw(401, 'Incorrect credentials.');
      }

      await user.assignHashSaltPair(newPassword);

      await user.save();

      ctx.body = {
        success: true,
      };
    },
  ],
});

export default router;
