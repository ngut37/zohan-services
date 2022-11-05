import joiRouter, { Joi } from 'koa-joi-router';

import { generateEmailRegex } from '@utils/email';

import { User } from '@models/user';
import { OAuthType, O_AUTH_TYPES } from '@models/user/types';

import { formatPhoneNumber } from '@utils/phone-number';

/* Example request body
  Local auth system sign up
  {
    "name": "John Doe",
    "email": "johndoe@email.com",
    "password": "123456"
  }

  OAuth sign up
  {
    "name": "John Doe",
    "email": "johndoe@google.com",
    "oAuth": {
      "userId": "116546600935596",
      "type": "facebook"
    }
  }
*/

const router = joiRouter();

type RequestBody = {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  oAuth?: {
    userId: string;
    type: OAuthType;
  };
};

const requestBodySchema = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string(),
  oAuth: {
    userId: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.keys(O_AUTH_TYPES))
      .required(),
  },
};

router.route({
  path: '/register',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    async (ctx) => {
      const body = ctx.request.body as RequestBody;
      const { name, email, password, phoneNumber, oAuth } = body;

      // check for email duplicity. Make the periods
      const emailRegex = generateEmailRegex(email);
      const userFoundByEmail = await User.findOne({
        email: { $regex: emailRegex },
      });
      if (userFoundByEmail)
        return ctx.throw(409, 'This email has already been used.');

      // create user
      const user = new User({
        name,
        email,
      });

      if (phoneNumber) {
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        user.phoneNumber = formattedPhoneNumber;
      }

      // skip password handler in case of oAuth user
      if (oAuth) {
        const { userId, type } = oAuth;
        user.oAuth = { userId, type };
        await user.save();
        return;
      } else if (password) {
        await user.assignHashSaltPair(password);
      } else {
        ctx.throw(400);
      }

      await user.save();

      // generate JWT access-refresh pair
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      ctx.cookies.set('access_token', accessToken, { httpOnly: true });
      ctx.cookies.set('refresh_token', refreshToken, { httpOnly: true });

      ctx.status = 201;

      ctx.body = {
        success: true,
      };
    },
  ],
});

export default router;
