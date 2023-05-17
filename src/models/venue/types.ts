import { Schema } from 'mongoose';

import { enumerate } from '@utils/enumerate';

export type Time = {
  hour: number;
  minute: number;
};

export type BusinessHoursInterval = {
  openingTime: Time;
  closingTime: Time;
};

export const DAYS = enumerate([
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
]);

export type Day = keyof typeof DAYS;

export type WeeklyBusinessHours = Partial<
  { [x in Day]: BusinessHoursInterval }
>;
const businessHoursIntervalSchema = new Schema<BusinessHoursInterval>(
  {
    openingTime: {
      hour: {
        type: Number,
        min: 0,
        max: 23,
        required: true,
      },
      minute: {
        type: Number,
        min: 0,
        max: 59,
        required: true,
      },
    },
    closingTime: {
      hour: {
        type: Number,
        min: 0,
        max: 23,
        required: true,
      },
      minute: {
        type: Number,
        min: 0,
        max: 59,
        required: true,
      },
    },
  },
  { _id: false },
);

// a day is not required to have defined business hours, which means it is closed
export const weeklyBusinessHoursSchema = new Schema<WeeklyBusinessHours>(
  {
    mon: businessHoursIntervalSchema,
    tue: businessHoursIntervalSchema,
    wed: businessHoursIntervalSchema,
    thu: businessHoursIntervalSchema,
    fri: businessHoursIntervalSchema,
    sat: businessHoursIntervalSchema,
    sun: businessHoursIntervalSchema,
  },
  { _id: false },
);
