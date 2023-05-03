import { WeeklyBusinessHours } from '@models/venue';

export const validateBusinessHours = (businessHours: WeeklyBusinessHours) => {
  const days = Object.keys(businessHours) as Array<keyof WeeklyBusinessHours>;

  for (const day of days) {
    const { openingTime, closingTime } = businessHours[day] || {};

    if (!openingTime || !closingTime) {
      throw new Error(`Opening and closing times must be provided for ${day}.`);
    }

    if (openingTime.hour > closingTime.hour) {
      throw new Error(
        `Opening time (${openingTime.hour}:${openingTime.minute}) cannot be after closing time (${closingTime.hour}:${closingTime.minute}) on ${day}`,
      );
    }

    if (
      openingTime.hour === closingTime.hour &&
      openingTime.minute > closingTime.minute
    ) {
      throw new Error(
        `Opening time (${openingTime.hour}:${openingTime.minute}) cannot be after closing time (${closingTime.hour}:${closingTime.minute}) on ${day}`,
      );
    }
  }
};
