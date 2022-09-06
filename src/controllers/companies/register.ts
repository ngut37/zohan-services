import { ParameterizedContext } from 'koa';
import joiRouter, { Joi } from 'koa-joi-router';

import { Region } from '@models/region';
import { District } from '@models/district';
import { Momc } from '@models/momc';
import { Company } from '@models/company';

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

type RequestBody = {
  ico: string;
  name: string;
  // address: AddressInfo;
  stringAddress: string;

  regionString: string;
  districtString: string;
  /** momc */
  quarterString?: string;
};

const requestBodySchema = {
  ico: Joi.string().length(8).required(),
  name: Joi.string().required(),

  stringAddress: Joi.string().required(),

  regionString: Joi.string().required(),
  districtString: Joi.string().required(),
  quarterString: Joi.string(), // momc
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
      const {
        ico,
        name,
        stringAddress,
        regionString,
        districtString,
        quarterString,
      } = body;

      // if company with ICO already exists,
      const [foundCompanyByIco] = await Company.find({ ico });
      if (foundCompanyByIco) {
        if (foundCompanyByIco.incomplete) {
          // return found company to finish registration
          return ctx.throw(
            400,
            'A company with this IČO was created but not completed.',
          );
        } else {
          // throw CONFLICT error
          return ctx.throw(
            409,
            'A company with this IČO is already registered.',
          );
        }
      }

      const region = await Region.findOne({
        name: { $regex: new RegExp(regionString, 'i') },
      });

      if (!region) {
        return ctx.throw(
          500, // 500 - internal server error because database should contain data
          `Region with name "${regionString} was not found."`,
        );
      }

      const district = await District.findOne({
        name: { $regex: new RegExp(districtString, 'i') },
      });

      if (!district) {
        return ctx.throw(
          500, // 500 - internal server error because database should contain data
          `District with name "${districtString} was not found."`,
        );
      }

      let momc: Momc | null = null;
      let mopId: Momc['mop'] | undefined = undefined;
      if (quarterString) {
        momc = await Momc.findOne({
          name: { $regex: new RegExp(quarterString, 'i') },
        });

        if (!momc) {
          return ctx.throw(
            500, // 500 - internal server error because database should contain data
            `M with name "${districtString} was not found."`,
          );
        }

        mopId = momc.mop;
      }

      // create company
      const createdCompany = new Company({
        ico,
        name,

        stringAddress,

        region,
        district,
        mop: mopId,
        momc,
      });
      await createdCompany.save();

      ctx.status = 201;

      ctx.body = {
        success: true,
        data: createdCompany.depopulate().toObject(),
      };
    },
  ],
});

export default router;
