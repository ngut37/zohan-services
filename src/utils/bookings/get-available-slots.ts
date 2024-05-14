import { addMinutes, getDay, setHours } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { looseIsDateAfter } from '@utils/date/non-strict-date-comparator';
import { getDayName } from '@utils/date/map-day-index-to-day';

import { ServiceAttributes } from '@models/service';
import { BusinessHoursInterval, VenueAttributes } from '@models/venue';
import { BookingAttributes } from '@models/booking';

import { isDateBookingCollision } from './is-date-booking-collision';

export const getAvailableSlots = ({
  zonedTime,
  service,
  venue,
  bookings,
}: {
  zonedTime: Date;
  service: ServiceAttributes;
  venue: VenueAttributes;
  bookings: BookingAttributes[];
}): Date[] => {
  const dayName = getDayName(getDay(zonedTime));

  if (!venue.businessHours[dayName]) {
    return [];
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

  const availableBookingSlots: Date[] = [];

  let potentialBookingStart = new Date(openingDateTime);
  let endLoop = false;

  do {
    // add booking length in minutes to opening time
    const potentialBookingEnd = new Date(
      addMinutes(potentialBookingStart, serviceLength),
    );
    // is booking end after closing time
    const isBookingEndAfterClosingTime = looseIsDateAfter(
      potentialBookingEnd,
      closingDateTime,
    );

    if (isBookingEndAfterClosingTime) {
      endLoop = true;
      break;
    }

    // do potential booking start and end times collide with existing bookings
    const isBookingCollision = isDateBookingCollision({
      zonedTime: potentialBookingStart,
      service,
      venue,
      bookings,
    });

    if (!isBookingCollision) {
      availableBookingSlots.push(potentialBookingStart);
    }

    // add 15 minute to potential booking start time
    potentialBookingStart = addMinutes(potentialBookingStart, 15);
  } while (!endLoop);

  return availableBookingSlots;
};
