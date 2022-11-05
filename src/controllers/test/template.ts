import joiRouter, { Joi } from 'koa-joi-router';

/*
  To test this endpoint, send a request to e.g.:
  {baseUrl}/test/5e592d1e533ae6d6aa27ca70?companyId=5e1596a4c0acdeb49109930b

  Request body can be:
  {
    "name": "John Doe",
    "email": "johndoe@email.com"
  }
*/

const router = joiRouter();

type RequestParams = {
  id: string;
};

type RequestQuery = {
  companyId: string;
};

type RequestBody = {
  name: string;
  email: string;
};

const requestParamsSchema = {
  id: Joi.string().hex().length(24).required(),
};

const requestQuerySchema = {
  companyId: Joi.string().hex().length(24).allow('', null),
};

const requestBodySchema = {
  name: Joi.string().required(),
  email: Joi.string().required(),
};

router.route({
  path: '/:id',
  method: 'post',
  validate: {
    params: requestParamsSchema,
    query: requestQuerySchema,
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    /*
      Middleware handlers go here (the order matters)
      e.g. authentication / authorization middleware
    */
    (ctx) => {
      // params
      const params = ctx.request.params as RequestParams;
      const { id } = params;

      // query is optional
      const query = ctx.request.query as RequestQuery;
      const { companyId } = query;

      // body
      const body = ctx.request.body as RequestBody;
      const { name, email } = body;

      ctx.body = {
        success: true,
        data: {
          params: {
            id,
          },
          query: {
            companyId,
          },
          body: {
            name,
            email,
          },
        },
      };
    },
  ],
});

export default router;
