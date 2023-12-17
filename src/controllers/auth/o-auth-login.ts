// ! WIP, not safe for production

import joiRouter, { Joi } from 'koa-joi-router';

import { User } from '@models/user';

import { generateEmailRegex } from '@utils/email';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

const router = joiRouter();

type RequestBody = {
  email: string;
};

const requestBodySchema = {
  email: Joi.string().required(),
};

router.route({
  path: '/o-auth-login',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    async (ctx) => {
      const { email } = ctx.request.body as RequestBody;

      const emailRegex = generateEmailRegex(email);

      const userFoundByEmail = await User.findOne({
        email: { $regex: emailRegex },
      });

      if (!userFoundByEmail) return ctx.throw(401, 'Incorrect credentials.');

      // generate JWT access-refresh pair
      const accessToken = userFoundByEmail.generateAccessToken();
      const refreshToken = userFoundByEmail.generateRefreshToken();

      const productionEnvironment =
        config.get(CONFIG_KEYS.APP_ENV) === 'production';
      ctx.cookies.secure = productionEnvironment;

      // ! this is a hack to make deployed front-end working
      ctx.cookies.set('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: productionEnvironment,
      });
      ctx.cookies.set('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: productionEnvironment,
      });

      ctx.body = { success: true, data: { accessToken } };
    },
  ],
});

export default router;
