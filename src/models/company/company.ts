import { Schema, Model, HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

import { Timestamps } from '@models/shared/timestamp';

import { mongoose } from '..';
import { addressSchema, AddressType } from '@models/shared/location';

export type RawCompany = {
  ico: string;
  // https://gist.github.com/hackenbruder/a71c62b0b7d83f317c04f7a0308f2f26
  legalForm: number;
  name: string;
} & AddressType;

export type CompanyAttributes = RawCompany & {
  _id: ObjectId;
  complete: boolean;
} & Timestamps;

type CompanyModel = Model<CompanyAttributes>;

export type Company = HydratedDocument<CompanyAttributes>;

const schema = new Schema<CompanyAttributes, CompanyModel>(
  {
    ico: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    legalForm: {
      type: Number,
      // TODO: change to true once Admin app is ready
      required: false,
    },

    complete: {
      type: Boolean,
      default: false,
    },

    ...addressSchema,
  },
  { timestamps: true },
);

export const Company = mongoose.model<CompanyAttributes, CompanyModel>(
  'Company',
  schema,
  'companies',
);
