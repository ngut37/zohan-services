import { Schema, Document } from 'mongoose';

import { Company } from '../company';

import { mongoose } from '..';

export type VenueAttributes = {
  name: string;
  company: Company;
  address: string;
};

export type Venue = VenueAttributes & Document;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    residence: {
      type: String,
      required: true,
    },
    company: { type: String, ref: 'Company', required: true },
  },
  { timestamps: true },
);

// indexes
schema.index({ ico: 1 });

export const Venue = mongoose.model<Venue>('Venue', schema, 'venues');
