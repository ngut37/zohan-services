import { Schema, Model, HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

import { Timestamps } from '@models/shared/timestamp';
import { addressSchema, AddressType } from '@models/shared/location';
import { Point, pointSchema } from '@models/shared/point';

import { Company } from '../company';
import { mongoose } from '..';

import { WeeklyBusinessHours, weeklyBusinessHoursSchema } from './types';

export type VenueAttributes = {
  _id: ObjectId;
  name: string;
  company: Company['_id'];
  location: Point;
  businessHours: WeeklyBusinessHours;
} & AddressType &
  Timestamps;

type VenueModel = Model<VenueAttributes>;

export type Venue = HydratedDocument<VenueAttributes>;

const schema = new Schema<VenueAttributes, VenueModel>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    ...addressSchema, // string address will serve as Venue Name
    location: pointSchema,

    businessHours: {
      type: weeklyBusinessHoursSchema,
      required: true,
      default: {
        mon: {
          openingTime: { hour: 8, minute: 0 },
          closingTime: { hour: 17, minute: 0 },
        },
        tue: {
          openingTime: { hour: 8, minute: 0 },
          closingTime: { hour: 17, minute: 0 },
        },
        wed: {
          openingTime: { hour: 8, minute: 0 },
          closingTime: { hour: 17, minute: 0 },
        },
        thu: {
          openingTime: { hour: 8, minute: 0 },
          closingTime: { hour: 17, minute: 0 },
        },
        fri: {
          openingTime: { hour: 8, minute: 0 },
          closingTime: { hour: 17, minute: 0 },
        },
        sat: {
          openingTime: { hour: 8, minute: 0 },
          closingTime: { hour: 17, minute: 0 },
        },
        sun: {
          openingTime: { hour: 8, minute: 0 },
          closingTime: { hour: 17, minute: 0 },
        },
      },
    },
  },
  { timestamps: true },
);

schema.index(
  {
    momc: 1,
    district: 1,
    region: 1,
  },
  {
    name: 'venue_list',
  },
);

export const Venue = mongoose.model<VenueAttributes, VenueModel>(
  'Venue',
  schema,
  'venues',
);
