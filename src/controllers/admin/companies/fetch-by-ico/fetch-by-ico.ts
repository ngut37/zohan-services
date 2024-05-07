import axios from 'axios';
import joiRouter, { Joi } from 'koa-joi-router';

import { Company } from '@models/company';

import {
  CompanyData,
  formatFetchedCompany,
} from '@utils/fetched-company-formatter';
import { mapCompanyToFormData } from './utils';

/* Example request body
  {
      "ico": "05344948"
  }
*/

const router = joiRouter();

type RequestBody = {
  ico: string;
};

const requestQuerySchema = {
  ico: Joi.string().length(8).required(),
};

router.route({
  path: '/fetch-by-ico',
  method: 'post',
  validate: {
    body: requestQuerySchema,
    type: 'json',
  },
  handler: async (ctx) => {
    const { ico } = ctx.request.body as RequestBody;

    // return company form data if it already exists
    const [foundCompany] = await Company.find({ ico });

    if (foundCompany) {
      return (ctx.body = {
        success: true,
        data: await mapCompanyToFormData(foundCompany),
      });
    }

    try {
      // fetch company and return it as company form data
      const fetchResult = await axios.get<CompanyData>(
        `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      );

      const formattedResult = formatFetchedCompany(fetchResult.data);

      const fetchedCompany = new Company({ ...formattedResult, ico });

      ctx.body = {
        success: true,
        data: await mapCompanyToFormData(fetchedCompany),
      };
    } catch (error) {
      return ctx.throw(404, 'Company with given ICO not found.');
    }
  },
});

export default router;
