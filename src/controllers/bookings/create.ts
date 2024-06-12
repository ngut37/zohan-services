import { ObjectId } from 'mongodb';
import joiRouter, { Joi } from 'koa-joi-router';
import { addMinutes, endOfDay, startOfDay } from 'date-fns';

import { protectRouteMiddleware } from '@middlewares/protect';

import { CompleteAccessTokenPayload } from '@utils/auth/user-auth';
import { isDateBookingCollision } from '@utils/bookings/is-date-booking-collision';

import { Booking, BookingAttributes } from '@models/booking';
import { Venue } from '@models/venue';
import { Staff } from '@models/staff';
import { mapEnumToFormattedCzechName, Service } from '@models/service';
import { Company } from '@models/company';
import { VenueAttributes } from '@models/venue';
import { sendBookingConfirmationEmail } from '@utils/mailer';
import { Region } from '@models/region';
import { District } from '@models/district';
import { Mop } from '@models/mop';

const router = joiRouter();

type RequestBody = {
  venueId: string;
  staffId: string;
  serviceId: string;
  start: string;
};

const requestBodySchema = {
  venueId: Joi.string().hex().length(24).required(),
  staffId: Joi.string().hex().length(24).required(),
  serviceId: Joi.string().hex().length(24).required(),
  start: Joi.string().isoDate().required(),
};

router.route({
  path: '/',
  method: 'post',
  validate: {
    body: requestBodySchema,
    type: 'json',
  },
  handler: [
    protectRouteMiddleware({
      allowUnauthorized: false,
    }),
    async (ctx) => {
      const { id: userId, user } = ctx.state.auth as CompleteAccessTokenPayload;

      const body = ctx.request.body as RequestBody;
      const { venueId, staffId, serviceId, start } = body;

      // validate venue exists
      const venue = await Venue.findById(venueId).populate<{
        region: Region;
        district: District;
        momc?: Mop;
        company: Company;
      }>(['region', 'district', 'momc', 'company']);
      if (!venue) {
        ctx.throw(400, `Venue with ID "${venueId}" not found.`);
        return;
      }

      // validate staff exists
      const staff = await Staff.findById(staffId);
      if (!staff) {
        ctx.throw(400, `Staff with ID "${staffId}" not found.`);
        return;
      }

      // validate service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        ctx.throw(400, `Service with ID "${serviceId}" not found.`);
        return;
      }

      const serviceLengthInMinutes = service.length;
      const startDate = new Date(start);
      const endDate = new Date(addMinutes(startDate, serviceLengthInMinutes));

      // validate start and end
      if (startDate > endDate) {
        ctx.throw(400, 'Start date must be before end date.');
        return;
      }

      // validate that booking is not colliding with another booking
      // this is not optimal (querying all bookings for a venue for that day)
      const startOfDayDate = startOfDay(startDate);
      const endOfDayDate = endOfDay(startDate);
      const bookings = await Booking.find({
        venue: venueId,
        staff: staffId,
        start: { $gte: startOfDayDate },
        end: { $lte: endOfDayDate },
      }).lean();

      const isBookingColliding = isDateBookingCollision({
        zonedTime: startDate,
        service,
        venue: venue as unknown as VenueAttributes,
        bookings,
      });

      if (isBookingColliding) {
        ctx.throw(400, 'Booking is colliding with another booking.');
        return;
      }

      const bookingAttributes: Omit<BookingAttributes, '_id'> = {
        venue: new ObjectId(venueId),
        staff: new ObjectId(staffId),
        service: new ObjectId(serviceId),
        start: startDate,
        end: endDate,
        existingCustomer: new ObjectId(userId),
      };

      const createdBooking = new Booking(bookingAttributes);

      await createdBooking.save();

      await sendBookingConfirmationEmail({
        to: user.email,
        bookingDetails: {
          venueName: venue.name,
          venueStringAddress: `${venue.stringAddress}, ${
            venue.momc?.name ?? venue.district.name
          }, ${venue.region.name}`,
          serviceName: mapEnumToFormattedCzechName(service.name),
          staffName: staff.name,
          start: startDate,
          end: endDate,
        },
      });

      ctx.body = {
        success: true,
        data: {
          ...createdBooking.toObject(),
          venue: venue.toObject(),
          staff: staff.toObject(),
          service: service.toObject(),
        },
      };
    },
  ],
});

export default router;
