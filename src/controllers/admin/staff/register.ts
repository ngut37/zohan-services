/**
 * ! NOT USED
 */
import joiRouter, { Joi } from 'koa-joi-router';

import { generateEmailRegex } from '@utils/email';

import { Staff } from '@models/staff';
import { Role, ROLES } from '@models/shared/roles';
import { Company } from '@models/company';
import { Venue } from '@models/venue';
import { ObjectId } from 'mongodb';

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
  password: string;
  companyId: string;
  venueId?: string;
  role?: Role;
};

const requestBodySchema = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  // TODO: add password validation (FE validation already exists)
  password: Joi.string().required(),
  companyId: Joi.string().hex().length(24).required(),
  venueId: Joi.string().hex().length(24),
  role: Joi.string().valid(...Object.keys(ROLES)),
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
      const { name, email, password, companyId, venueId, role } = body;

      // check if company exists
      const foundCompany = await Company.findById(companyId);
      if (!foundCompany)
        return ctx.throw(400, `Company with ID ${companyId} does not exist.`);

      let foundVenue: Venue | null = null;
      if (venueId) {
        // check if company exists
        foundVenue = await Venue.findOne({
          _id: new ObjectId(venueId),
          company: companyId,
        });
        if (!foundVenue)
          return ctx.throw(400, `Venue with ID ${venueId} does not exist.`);
      }

      // check for email duplicity, ignore periods for Gmail
      const emailRegex = generateEmailRegex(email);
      const userFoundByEmail = await Staff.findOne({
        email: { $regex: emailRegex },
      });
      if (userFoundByEmail)
        return ctx.throw(409, `Staff with email ${email} already exists`);

      // create new staff
      const createdStaff = new Staff({
        name,
        email,
        role,
        company: foundCompany,
        venue: foundVenue,
      });

      await createdStaff.assignHashSaltPair(password);

      await createdStaff.save();

      // generate JWT access-refresh pair
      const accessToken = createdStaff.generateAccessToken();
      const refreshToken = createdStaff.generateRefreshToken();

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
