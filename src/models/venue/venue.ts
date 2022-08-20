import { Schema, Model, HydratedDocument } from 'mongoose';

import { Company } from '../company';

import { mongoose } from '..';
import { Timestamps } from '@models/shared/timestamp';

export type VenueAttributes = {
  name: string;
  company: Company;
  address: string;
} & Timestamps;

type VenueModel = Model<VenueAttributes>;

export type Venue = HydratedDocument<VenueAttributes>;

const schema = new Schema<VenueAttributes, VenueModel>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    company: { type: String, ref: 'Company', required: true },
  },
  { timestamps: true },
);

// indexes
schema.index({ ico: 1 });

export const Venue = mongoose.model<VenueAttributes, VenueModel>(
  'Venue',
  schema,
  'venues',
);
