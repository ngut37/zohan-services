import joiRouter from 'koa-joi-router';

import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';

import { Venue } from '@models/venue';
import { Region } from '@models/region';
import { District } from '@models/district';

import { CompanyAccessTokenPayload } from '@utils/company-auth';
import { Momc } from '@models/momc';

const router = joiRouter();

router.route({
  path: '/',
  method: 'get',
  handler: [
    adminProtectRouteMiddleware({
      allowUnauthorized: false,
      allowedRoles: ['admin', 'editor'],
    }),
    async (ctx) => {
      const { company } = ctx.state.auth as CompanyAccessTokenPayload;

      const fetchedVenuesByCompanyId = await Venue.find(
        { company },
        undefined,
        { sort: { createdAt: -1 } }, // DESC sort
      ).populate<{
        region: Region;
        district: District;
        momc?: Momc;
      }>(['region', 'district', 'momc']);

      const venuesWithPopulatedLocation = fetchedVenuesByCompanyId.map(
        ({ _id, stringAddress, region, district, momc }) => {
          return {
            _id,
            stringAddress,
            region: region.name,
            district: district.name,
            momc: momc?.name,
          };
        },
      );

      ctx.body = {
        success: true,
        data: venuesWithPopulatedLocation,
      };
    },
  ],
});

export default router;
