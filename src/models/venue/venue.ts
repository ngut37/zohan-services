import { Schema, Model, HydratedDocument } from 'mongoose';

import { Timestamps } from '@models/shared/timestamp';
import { addressSchema, AddressType } from '@models/shared/location';
import { Point, pointSchema } from '@models/shared/point';

import { Company } from '../company';
import { mongoose } from '..';

export type VenueAttributes = {
  name: string;
  company: Company['_id'];
  location: Point;
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
  },
  { timestamps: true },
);

// TODO: create index for look-up

export const Venue = mongoose.model<VenueAttributes, VenueModel>(
  'Venue',
  schema,
  'venues',
);
