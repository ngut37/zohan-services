import joiRouter, { Joi } from 'koa-joi-router';

import { generateEmailRegex } from '@utils/email';
import * as mailer from '@utils/mailer';

import { User } from '@models/user';
import { OAuthType, O_AUTH_TYPES } from '@models/user/types';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

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
  password: Joi.string().optional().default(''),
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

      // check for email duplicity
      const emailRegex = generateEmailRegex(email);
      const userFoundByEmail = await User.exists({
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
        user.status = 'verified';
        await user.save();

        return;
      } else if (password) {
        // sanity check
        user.status = 'not_verified';
        await user.assignHashSaltPair(password);

        const userEmailVerificationToken =
          user.generateEmailVerificationToken();

        try {
          await mailer.sendVerificationEmailForCustomer({
            to: user.email,
            verificationLink: `${config.get(
              CONFIG_KEYS.APP_URL,
            )}/auth/verify-email?token=${userEmailVerificationToken}`,
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        ctx.throw(400);
      }

      await user.save();

      ctx.body = {
        success: true,
      };
    },
  ],
});

export default router;
