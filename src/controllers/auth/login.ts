import joiRouter, { Joi } from 'koa-joi-router';

import { User } from '@models/user';

import { generateEmailRegex } from '@utils/email';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

/* Example request body
  {
    "email": "johndoe@email.com",
    "password": "123456"
  }
*/

const router = joiRouter();

type RequestBody = {
  email: string;
  password: string;
};

const requestBodySchema = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

router.route({
  path: '/login',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    async (ctx) => {
      const body = ctx.request.body as RequestBody;
      const { email, password } = body;

      const emailRegex = generateEmailRegex(email);

      const userFoundByEmail = await User.findOne({
        email: { $regex: emailRegex },
      });

      if (!userFoundByEmail) return ctx.throw(401, 'Incorrect credentials.');

      const isValidPassword = await userFoundByEmail.validatePassword(password);

      if (!isValidPassword) return ctx.throw(401, 'Incorrect credentials.');

      // generate JWT access-refresh pair
      const accessToken = userFoundByEmail.generateAccessToken();
      const refreshToken = userFoundByEmail.generateRefreshToken();

      // ! this is a hack to make deployed front-end working
      const productionEnvironment =
        config.get(CONFIG_KEYS.APP_ENV) === 'production';
      ctx.cookies.secure = productionEnvironment;

      ctx.cookies.set('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: productionEnvironment,
      });

      ctx.body = { success: true, data: { accessToken } };
    },
  ],
});

export default router;
