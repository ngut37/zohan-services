import { ParameterizedContext } from 'koa';
import joiRouter, { Joi } from 'koa-joi-router';

import { generateEmailRegex } from '@utils/email';

import { Gender, GENDERS, Role, ROLES } from '@models/users/types';
import { User } from '@models/users/user';

/* Example request body
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@email.com",
    "password": "123456",
    "birthYear": "1999",
    "gender": "male",
    "roles": ["client"]
  }
*/

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
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  birthYear: Joi.number().allow(null).min(minBirthYear).max(maxBirthYear),
  gender: Joi.string().valid(...Object.values(GENDERS)),
  roles: Joi.array()
    .items(Joi.string().valid(...Object.keys(ROLES)))
    .required(),
};

router.route({
  path: '/register',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    async (ctx: ParameterizedContext) => {
      const body = ctx.request.body as RequestBody;
      const { firstName, lastName, email, password, gender, birthYear, roles } =
        body;

      // Check for email duplicity. Make the periods
      const emailRegex = generateEmailRegex(email);
      const userFoundByEmail = await User.findOne({
        email: { $regex: emailRegex },
      });
      if (userFoundByEmail)
        return ctx.throw(409, 'This email has already been used.');

      // create user
      const user = new User({
        firstName,
        lastName,
        email,
        gender,
        birthYear: new Date(birthYear, 0, 1),
        roles,
      });
      await user.assignHashSaltPair(password);
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
