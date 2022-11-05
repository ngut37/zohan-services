import joiRouter, { Joi } from 'koa-joi-router';

const router = joiRouter();

type RequestBody = {
  companyId: string;
  timeBlock: {
    from: Date;
    to: Date;
  };
};

const requestBodySchema = {
  companyId: Joi.string().required(),
  timeBlock: Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
  }).required(),
};

router.route({
  path: '/:id',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    // * Middleware handles go here, the order matters
    (ctx) => {
      // body
      const body = ctx.request.body as RequestBody;
      const { companyId, timeBlock } = body;
      const { from, to } = timeBlock;

      ctx.body = {
        success: true,
        data: `Reservation was made for company with ID ${companyId} from ${from.toDateString()} till ${to.toDateString()}`,
      };
    },
  ],
});

export default router;
