import joiRouter, { Joi } from 'koa-joi-router';

import { Venue } from '@models/venue';
import { Region } from '@models/region';
import { District } from '@models/district';
import { Momc } from '@models/momc';
import { Staff } from '@models/staff';
import { Service } from '@models/service';
import { Company } from '@models/company';

const router = joiRouter();

type RequestParams = {
  id: string;
};

router.route({
  path: '/:id',
  method: 'get',
  validate: {
    params: {
      id: Joi.string().hex().length(24),
    },
  },
  handler: [
    async (ctx) => {
      const { id } = ctx.request.params as RequestParams;

      const [foundVenue] = await Venue.find({
        _id: id,
      }).populate<{
        region: Region;
        district: District;
        momc?: Momc;
        company: Company;
      }>(['region', 'district', 'momc', 'company']);

      if (!foundVenue) {
        return ctx.throw(404, `Venue with ID "${id}" was not found.`);
      }

      const staff = await Staff.find(
        {
          venue: id,
        },
        { password: 0, __v: 0 },
      ).lean();

      const services = await Service.find({
        venue: id,
      }).lean();

      const venuesWithPopulatedLocation = {
        _id: foundVenue._id,
        stringAddress: foundVenue.stringAddress,
        region: foundVenue.region.name,
        district: foundVenue.district.name,
        momc: foundVenue.momc?.name,
        businessHours: foundVenue.businessHours,
        coordinates: foundVenue.location.coordinates,
        companyName: foundVenue.company.name,
      };

      ctx.body = {
        success: true,
        data: { venue: venuesWithPopulatedLocation, staff, services },
      };
    },
  ],
});

export default router;
