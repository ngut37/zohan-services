import { ParameterizedContext } from 'koa';
import joiRouter, { Joi } from 'koa-joi-router';

import { protectRouteMiddleware } from 'controllers/middlewares/access-token';

import { ExtendedAccessTokenPayload } from '@utils/auth';

import { Gender, GENDERS, Role, ROLES } from '@models/users/types';
import { User } from '@models/users/user';

const minBirthYear = 1900;
const maxBirthYear = new Date().getFullYear();

const router = joiRouter();

type RequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthYear: number;
  gender: Gender;
  roles: Role[];
};

const requestBodySchema = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  birthYear: Joi.number().allow(null).min(minBirthYear).max(maxBirthYear),
  gender: Joi.string().valid(...Object.values(GENDERS)),
  roles: Joi.array().items(Joi.string().valid(...Object.keys(ROLES))),
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
      const { password, ...modifications } = ctx.request.body as RequestBody;
      const { userId } = ctx.state.auth as ExtendedAccessTokenPayload;

      const user = await User.findById(userId, { password: 0 });

      if (!user) {
        ctx.throw(404, `User not found with ID ${userId}`);
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
