import axios from 'axios';
import joiRouter, { Joi } from 'koa-joi-router';
import { ParameterizedContext } from 'koa';
import { XMLParser } from 'fast-xml-parser';

import { Company } from '@models/company';

import {
  formatFetchedCompany,
  ParsedRawCompany,
} from '@utils/fetched-company-formatter';

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
  handler: async (ctx: ParameterizedContext) => {
    const { ico } = ctx.request.body as RequestBody;

    // check if company exists
    const [foundCompany] = await Company.find({ ico });

    if (foundCompany) {
      return (ctx.body = { success: true, data: foundCompany.toObject() });
    }

    const fetchResult = await axios.get(
      `https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_std.cgi?ico=${ico}`,
    );

    const parser = new XMLParser();

    const parsedResult = parser.parse(fetchResult.data) as ParsedRawCompany;

    const formattedResult = formatFetchedCompany(parsedResult);

    if (!formattedResult) {
      return ctx.throw(404, 'Company with given ICO not found.');
    }

    const createdCompany = new Company(formattedResult);

    ctx.body = { success: true, data: createdCompany.toObject() };
  },
});

export default router;
