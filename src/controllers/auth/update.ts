import { ParameterizedContext } from 'koa';
import joiRouter, { Joi } from 'koa-joi-router';

import { User } from '@models/user';

import { AccessTokenPayload } from '@utils/auth';
import { formatPhoneNumber } from '@utils/phone-number';

import { protectRouteMiddleware } from '@middlewares/access-token';

const router = joiRouter();

type RequestBody = {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
};

const requestBodySchema = {
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
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
    async (ctx: ParameterizedContext) => {
      const { password, phoneNumber, ...modifications } = ctx.request
        .body as RequestBody;
      const { id: userId } = ctx.state.auth as AccessTokenPayload;

      const user = await User.findById(userId, { password: 0 });

      if (!user) {
        ctx.throw(404, `User not found with ID ${userId}`);
      }

      if (phoneNumber) {
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        user.phoneNumber = formattedPhoneNumber;
      }

      user.set(modifications);

      if (password) {
        user?.assignHashSaltPair(password);
      }

      await user.save();

      ctx.body = {
        success: true,
        data: user,
      };
    },
  ],
});

export default router;
