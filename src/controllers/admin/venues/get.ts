import joiRouter from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';
import { Venue } from '@models/venue';

import { CompanyAccessTokenPayload } from '@utils/auth/company-auth';
import { Region } from '@models/region';
import { District } from '@models/district';
import { Momc } from '@models/momc';

const router = joiRouter();

type RequestParams = {
  id: string;
};

router.route({
  path: '/:id',
  method: 'get',
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { id } = ctx.request.params as RequestParams;
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      const [foundVenue] = await Venue.find({
        _id: id,
        company,
      }).populate<{
        region: Region;
        district: District;
        momc?: Momc;
      }>(['region', 'district', 'momc']);

      if (!foundVenue) {
        return ctx.throw(404, `Venue with ID "${id}" was not found.`);
      }

      const venuesWithPopulatedLocation = {
        _id: foundVenue._id,
        stringAddress: foundVenue.stringAddress,
        region: foundVenue.region.name,
        district: foundVenue.district.name,
        momc: foundVenue.momc?.name,
        businessHours: foundVenue.businessHours,
        coordinates: foundVenue.location.coordinates,
      };

      ctx.body = {
        success: true,
        data: { ...venuesWithPopulatedLocation },
      };
    },
  ],
});

export default router;
