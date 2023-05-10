import joiRouter, { Joi } from 'koa-joi-router';

import { CompanyAccessTokenPayload } from '@utils/company-auth';
import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { Venue } from '@models/venue';
import { Staff } from '@models/staff';
import { Role, ROLES } from '@models/shared/roles';
import { generateEmailRegex } from '@utils/email';

const router = joiRouter();

type RequestParams = {
  id: string;
};

type RequestBody = {
  email?: string;
  name?: string;
  role?: Role;
  venue?: string;
};

const requestBodySchema = {
  email: Joi.string().email(),
  name: Joi.string(),
  role: Joi.string()
    .valid(...Object.keys(ROLES))
    .required(),
  venue: Joi.string().hex().length(24),
};

router.route({
  path: '/:id/edit',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
      allowedRoles: ['admin'],
    }),
    async (ctx) => {
      const { id } = ctx.request.params as RequestParams;
      const { email, name, role, venue } = ctx.request.body as RequestBody;
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      const [foundStaffToUpdate] = await Staff.find({ _id: id, company });

      if (!foundStaffToUpdate) {
        return ctx.throw(404, `Staff with ID "${id}" was not found.`);
      }

      // check for email duplicity
      if (email) {
        const emailRegex = generateEmailRegex(email);
        const userFoundByEmail = await Staff.exists({
          email: { $regex: emailRegex },
          _id: { $ne: foundStaffToUpdate._id },
        });

        if (userFoundByEmail) {
          return ctx.throw(409, 'This email has already been used.');
        }

        foundStaffToUpdate.email = email;
      }
      if (name) {
        foundStaffToUpdate.name = name;
      }
      if (role) {
        foundStaffToUpdate.role = role;
      }
      if (venue) {
        // check venue exists
        const foundVenue = await Venue.findOne({
          _id: venue,
        });

        if (!foundVenue) {
          return ctx.throw(400, `Venue with ID "${venue}" was not found.`);
        }

        // check venues belong to staff's company
        if (
          foundVenue.company.toHexString() !==
          foundStaffToUpdate.company.toHexString()
        ) {
          return ctx.throw(
            400,
            "At least one of the venues do not belong to staff's company",
          );
        }

        foundStaffToUpdate.venue = foundVenue._id;
      } else {
        foundStaffToUpdate.venue = undefined;
      }

      await foundStaffToUpdate.save();

      ctx.body = {
        success: true,
        data: { foundVenue: foundStaffToUpdate },
      };
    },
  ],
});

export default router;
