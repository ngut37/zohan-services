import joiRouter, { Joi } from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';
import { CompanyAccessTokenPayload } from '@utils/company-auth';

import { Staff } from '@models/staff';
import { Role, ROLES } from '@models/shared/roles';

const router = joiRouter();

type RequestBody = {
  email: string;
  name: string;
  role: Role;
  venue: string;
};

const requestBodySchema = {
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.keys(ROLES))
    .required(),
  venue: Joi.string().hex().length(24),
};

router.route({
  path: '/create',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
      allowedRoles: ['admin', 'editor'],
    }),
    async (ctx) => {
      const body = ctx.request.body as RequestBody;
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      // check for email duplicity

      const [foundStaffByEmail] = await Staff.find({ email: body.email });

      if (foundStaffByEmail) {
        // throw CONFLICT error
        return ctx.throw(
          409,
          `Staff with email "${body.email}" already exists.`,
        );
      }

      const createdStaff = new Staff({
        ...body,
        company,
      });

      await createdStaff.assignHashSaltPair('123456');

      await createdStaff.save();

      ctx.body = {
        success: true,
        data: createdStaff,
      };
    },
  ],
});

export default router;
