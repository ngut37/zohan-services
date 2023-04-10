import joiRouter from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { CompanyAccessTokenPayload } from '@utils/company-auth';

import { Venue } from '@models/venue';
import { Service } from '@models/service';

const router = joiRouter();

type RequestParams = {
  id: string;
};

router.route({
  path: '/:id/services',
  method: 'get',
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
      allowedRoles: ['admin', 'editor'],
    }),
    async (ctx) => {
      const { id } = ctx.request.params as RequestParams;
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      const fetchedVenuesByCompanyId = await Venue.findOne({ id, company });

      if (!fetchedVenuesByCompanyId) {
        ctx.throw(404, 'Venue not found');
        return;
      }

      const services = await Service.find({
        venue: id,
      }).lean();

      ctx.body = {
        success: true,
        data: services,
      };
    },
  ],
});

export default router;
