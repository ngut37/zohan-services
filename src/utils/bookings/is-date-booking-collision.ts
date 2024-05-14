import { addMinutes, differenceInMinutes, getDay, setHours } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { getDayName } from '@utils/date/map-day-index-to-day';
import {
  looseIsDateAfter,
  looseIsDateBefore,
  looseIsDateEqual,
} from '@utils/date/non-strict-date-comparator';

import { ServiceAttributes } from '@models/service';
import { BusinessHoursInterval, VenueAttributes } from '@models/venue';
import { BookingAttributes } from '@models/booking';

export const isDateBookingCollision = ({
  zonedTime,
  service,
  venue,
  bookings,
}: {
  zonedTime: Date;
  service: ServiceAttributes;
  venue: VenueAttributes;
  bookings: BookingAttributes[];
}): boolean => {
  const dayName = getDayName(getDay(zonedTime));

  if (!venue.businessHours[dayName]) {
    return true;
  }

  const serviceLength = service.length;

  const openingDateTime = fromZonedTime(
    new Date(
      setHours(
        zonedTime,
        (venue.businessHours[dayName] as BusinessHoursInterval).openingTime
          .hour,
      ).setMinutes(
        (venue.businessHours[dayName] as BusinessHoursInterval).openingTime
          .minute,
      ),
    ),
    config.get(CONFIG_KEYS.DATE_FNZ_TIMEZONE),
  );

  const closingDateTime = fromZonedTime(
    new Date(
      setHours(
        zonedTime,
        (venue.businessHours[dayName] as BusinessHoursInterval).closingTime
          .hour,
      ).setMinutes(
        (venue.businessHours[dayName] as BusinessHoursInterval).closingTime
          .minute,
      ),
    ),
    config.get(CONFIG_KEYS.DATE_FNZ_TIMEZONE),
  );

  const businessOpeningTimeInMinutes = differenceInMinutes(
    closingDateTime,
    openingDateTime,
  );

  if (serviceLength > businessOpeningTimeInMinutes) {
    return true;
  }

  const closingDateTimeWithBookingLength = addMinutes(
    closingDateTime,
    -serviceLength,
  );

  const dateIsBeforeOpeningTime = looseIsDateBefore(zonedTime, openingDateTime);

  const dateIsAfterClosingTimeWithBookingLength = looseIsDateAfter(
    zonedTime,
    closingDateTimeWithBookingLength,
  );

  if (dateIsBeforeOpeningTime || dateIsAfterClosingTimeWithBookingLength) {
    return true;
  }

  if (!bookings.length) {
    return false;
  }

  // validate existing bookings collision
  return bookings.some((booking) => {
    const bookingStartDateTime = new Date(booking.start);
    const bookingEndDateTime = new Date(booking.end);

    const dateIsAfterBooking = looseIsDateAfter(
      zonedTime,
      bookingStartDateTime,
    );
    const dateIsEqualBooking = looseIsDateEqual(
      zonedTime,
      bookingStartDateTime,
    );
    const dateIsBeforeBooking = looseIsDateBefore(
      zonedTime,
      bookingEndDateTime,
    );

    if ((dateIsAfterBooking || dateIsEqualBooking) && dateIsBeforeBooking) {
      return true;
    }

    const dateWithServiceLength = addMinutes(zonedTime, serviceLength);

    const dateIsEqualBookingWithServiceLength = looseIsDateEqual(
      dateWithServiceLength,
      bookingStartDateTime,
    );

    if (dateIsEqualBookingWithServiceLength) {
      return false;
    }

    const dateIsAfterBookingWithServiceLength = looseIsDateAfter(
      dateWithServiceLength,
      bookingStartDateTime,
    );

    const dateIsBeforeBookingWithServiceLength = looseIsDateBefore(
      dateWithServiceLength,
      bookingEndDateTime,
    );

    if (
      dateIsAfterBookingWithServiceLength &&
      dateIsBeforeBookingWithServiceLength
    ) {
      return true;
    }

    if (dateIsBeforeBooking && dateIsAfterBookingWithServiceLength) {
      return true;
    }

    return false;
  });
};
