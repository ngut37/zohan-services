// import joiRouter, { Joi } from 'koa-joi-router';

// import { adminProtectRouteMiddleware } from '@middlewares/admin-protect';
// import { Venue } from '@models/venue';

// import { mapLocationToIds } from '../utils/map-location-to-ids';
// import { CompanyAccessTokenPayload } from '@utils/company-auth';

// const router = joiRouter();

// type RequestParams = {
//   id: string;
// };

// type RequestBody = {
//   type: ServiceType;
//   name: ServiceName;
//   venue: string;
//   staff: string[];
//   length: number;
// };

// const requestBodySchema = {
//   stringAddress: Joi.string().required(),

//   regionString: Joi.string().required(),
//   districtString: Joi.string().required(),
//   quarterString: Joi.string().allow(''), // momc
//   coordinates: Joi.array().items(Joi.number()).length(2).required(), // momc
// };

// router.route({
//   path: '/:id/edit',
//   method: 'post',
//   validate: {
//     body: requestBodySchema,
//     type: 'json',
//   },
//   handler: [
//     adminProtectRouteMiddleware({
//       allowUnauthorized: false,
//       allowedRoles: ['admin', 'editor'],
//     }),
//     async (ctx) => {
//       const { id } = ctx.request.params as RequestParams;
//       const body = ctx.request.body as RequestBody;
//       const { company } = ctx.state.auth as CompanyAccessTokenPayload;

//       const {
//         stringAddress,
//         regionString,
//         districtString,
//         quarterString,
//         coordinates,
//       } = body;

//       const [foundVenueToUpdate] = await Venue.find({ _id: id, company });

//       if (!foundVenueToUpdate) {
//         return ctx.throw(404, `Venue with ID "${id}" was not found.`);
//       }

//       const { region, district, mop, momc } = await mapLocationToIds({
//         regionString,
//         districtString,
//         quarterString,
//         ctx,
//       });

//       foundVenueToUpdate.stringAddress = stringAddress;
//       foundVenueToUpdate.region = region;
//       foundVenueToUpdate.district = district;
//       foundVenueToUpdate.mop = mop;
//       foundVenueToUpdate.momc = momc;
//       foundVenueToUpdate.location.coordinates = coordinates;

//       await foundVenueToUpdate.save();

//       ctx.body = {
//         success: true,
//         data: { foundVenue: foundVenueToUpdate },
//       };
//     },
//   ],
// });

// export default router;
