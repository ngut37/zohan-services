import joiRouter, { Joi } from 'koa-joi-router';

import { Region } from '@models/region';
import { District } from '@models/district';
import { Momc } from '@models/momc';
import { Company } from '@models/company';
import { Staff } from '@models/staff';
import { ROLES } from '@models/shared/roles';

import { CompanyFormData } from './types';

/* Example request body

{
  "ico": "05344948",
  "name": "Zohan Barbershop",
  "stringAddress": "Jankovcova 864/45",
  "regionString": "Hlavní město Praha",
  "districtString": "Hlavní město Praha",
  "quarterString": "Praha 7"
}

*/

const router = joiRouter();

type RequestBody = CompanyFormData & {
  staffName: string;
  email: string;
  password: string;
};

const requestBodySchema = {
  ico: Joi.string().length(8).required(),
  name: Joi.string().required(),
  legalForm: Joi.number(),

  stringAddress: Joi.string().required(),

  regionString: Joi.string().required(),
  districtString: Joi.string().required(),
  quarterString: Joi.string().allow(''), // momc
  coordinates: Joi.array().items(Joi.number()).length(2),

  staffName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  complete: Joi.boolean(),
};

router.route({
  path: '/create',
  method: 'put',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    async (ctx) => {
      const {
        ico,
        name,
        legalForm,
        stringAddress,
        regionString,
        districtString,
        quarterString,
        coordinates: _coordinates, // not used for Company model
        staffName,
        email,
        password,
      } = ctx.request.body as RequestBody;

      // if company with ICO already exists,
      const [foundCompanyByIco] = await Company.find({ ico });
      if (foundCompanyByIco) {
        // throw CONFLICT error
        return ctx.throw(409, 'A company with this ICO already exists.');
      }

      const region = await Region.findOne({
        name: { $regex: new RegExp(regionString, 'i') },
      });

      if (!region) {
        return ctx.throw(
          500, // 500 - internal server error because database should contain data
          `Region with name "${regionString} was not found.`,
        );
      }

      const district = await District.findOne({
        name: { $regex: new RegExp(districtString, 'i') },
      });

      if (!district) {
        return ctx.throw(
          500, // 500 - internal server error because database should contain data
          `District with name "${districtString} was not found.`,
        );
      }

      let momc: Momc | undefined;
      let mopId: Momc['mop'] | undefined = undefined;
      if (quarterString) {
        momc =
          (await Momc.findOne({
            name: { $regex: new RegExp(quarterString, 'i') },
          })) ?? undefined;

        // MOMC is found if MOMC is located in Prague
        if (momc) {
          mopId = momc.mop;
        }
      }

      // create company
      const createdCompany = new Company({
        ico,
        name,
        legalForm,

        stringAddress,

        region,
        district,
        mop: mopId,
        momc,

        complete: true,
      });

      // create admin staff
      const createdStaff = new Staff({
        name: staffName,
        email,
        role: ROLES.admin,
        company: createdCompany,
      });

      try {
        // assign salt and hashed password to staff
        await createdStaff.assignHashSaltPair(password);

        // persist company and staff
        await createdCompany.save();
        await createdStaff.save();
      } catch (error) {
        console.error(
          `Company creation failed for request body: ${JSON.stringify(
            ctx.request.body,
          )}`,
        );
        console.error(JSON.stringify(error));
        await createdCompany.delete();
        await createdStaff.delete();
      }

      ctx.status = 201;

      ctx.body = {
        success: true,
        data: createdCompany.depopulate().toObject(),
      };
    },
  ],
});

export default router;
