import { addMinutes, getDay, isSameDay, setHours } from 'date-fns';

import { looseIsDateAfter } from '@utils/date/non-strict-date-comparator';
import { getDayName } from '@utils/date/map-day-index-to-day';

import { ServiceAttributes } from '@models/service';
import { BusinessHoursInterval, VenueAttributes } from '@models/venue';
import { BookingAttributes } from '@models/booking';

import { isDateBookingCollision } from './is-date-booking-collision';

export const getAvailableSlots = ({
  date,
  service,
  venue,
  bookings,
}: {
  date: Date;
  service: ServiceAttributes;
  venue: VenueAttributes;
  bookings: BookingAttributes[];
}): Date[] => {
  const dayName = getDayName(getDay(date));

  if (!venue.businessHours[dayName]) {
    return [];
  }

  const serviceLength = service.length;

  const openingDateTime = new Date(
    setHours(
      date,
      (venue.businessHours[dayName] as BusinessHoursInterval).openingTime.hour,
    ).setMinutes(
      (venue.businessHours[dayName] as BusinessHoursInterval).openingTime
        .minute,
    ),
  );
  const closingDateTime = new Date(
    setHours(
      date,
      (venue.businessHours[dayName] as BusinessHoursInterval).closingTime.hour,
    ).setMinutes(
      (venue.businessHours[dayName] as BusinessHoursInterval).closingTime
        .minute,
    ),
  );

  const availableBookingSlots: Date[] = [];

  const bookingsForGivenDate = bookings.filter((booking) => {
    return isSameDay(new Date(booking.start), date);
  });

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
      date: potentialBookingStart,
      service,
      venue,
      bookings: bookingsForGivenDate,
    });

    if (!isBookingCollision) {
      availableBookingSlots.push(potentialBookingStart);
    }

    // add 15 minute to potential booking start time
    potentialBookingStart = addMinutes(potentialBookingStart, 15);
  } while (!endLoop);

  return availableBookingSlots;
};
