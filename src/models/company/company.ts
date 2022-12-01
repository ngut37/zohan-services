import { Schema, Model, HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

import { Timestamps } from '@models/shared/timestamp';

import { mongoose } from '..';
import { addressSchema, AddressType } from '@models/shared/location';

export type RawCompany = {
  ico: string;
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

    ...addressSchema,

    complete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Company = mongoose.model<CompanyAttributes, CompanyModel>(
  'Company',
  schema,
  'companies',
);
