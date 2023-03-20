import joiRouter, { Joi } from 'koa-joi-router';
import { ObjectId } from 'mongodb';

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
  venues?: string[];
};

const requestBodySchema = {
  email: Joi.string().email(),
  name: Joi.string(),
  role: Joi.string()
    .valid(...Object.keys(ROLES))
    .required(),
  venues: Joi.array().items(Joi.string().hex().length(24)),
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
      allowedRoles: ['admin', 'editor'],
    }),
    async (ctx) => {
      const { id } = ctx.request.params as RequestParams;
      const { email, name, role, venues } = ctx.request.body as RequestBody;
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

        if (userFoundByEmail)
          return ctx.throw(409, 'This email has already been used.');

        foundStaffToUpdate.email = email;
      }
      if (name) {
        foundStaffToUpdate.name = name;
      }
      if (role) {
        foundStaffToUpdate.role = role;
      }
      if (venues && venues.length) {
        // check venues exist
        const venuesObjectIds = venues.map(
          (venueStringId) => new ObjectId(venueStringId),
        );
        const foundVenues = await Venue.find({
          _id: { $in: venuesObjectIds },
        });

        // check venues belong to staff's company
        if (
          foundVenues.some(
            (foundVenue) =>
              foundVenue.company.toHexString() !==
              foundStaffToUpdate.company.toHexString(),
          )
        ) {
          return ctx.throw(
            400,
            "At least one of the venues do not belong to staff's company",
          );
        }
        foundStaffToUpdate.venues = venuesObjectIds;
      } else {
        foundStaffToUpdate.venues = [];
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
