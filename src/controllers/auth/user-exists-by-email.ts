import joiRouter, { Joi } from 'koa-joi-router';

import { generateEmailRegex } from '@utils/email';

import { User } from '@models/user';

const router = joiRouter();

router.route({
  path: '/email-exists/:email',
  method: 'get',
  validate: {
    params: {
      email: Joi.string().email().required(),
    },
  },
  handler: [
    async (ctx) => {
      const { email } = ctx.request.params;

      const emailRegex = generateEmailRegex(email);

      const userExists = await User.exists({ email: { $regex: emailRegex } });

      ctx.status = 200;

      ctx.body = {
        success: true,
        data: Boolean(userExists),
      };
    },
  ],
});

export default router;
