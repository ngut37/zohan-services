import { DAYS, Day } from '@models/venue';

export const getDayName = (dayNumber: number): Day => {
  if (dayNumber > 6 || dayNumber < 0) {
    throw new Error('Invalid day number');
  }

  const days = {
    0: DAYS.sun, // start with sunday because it's the first day of the week by JS convention
    1: DAYS.mon,
    2: DAYS.tue,
    3: DAYS.wed,
    4: DAYS.thu,
    5: DAYS.fri,
    6: DAYS.sat,
  };
  return days[dayNumber as keyof typeof days];
};
