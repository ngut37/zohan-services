import { Schema, Model, HydratedDocument, ObjectId } from 'mongoose';

import { Timestamps } from '@models/shared/timestamp';
import { RegionAttributes } from '@models/region';
import { DistrictAttributes } from '@models/district';
import { MopAttributes } from '@models/mop';
import { MomcAttributes } from '@models/momc';

import { mongoose } from '..';

export type RawCompany = {
  ico: string;
  name: string;

  stringAddress: string;

  region: RegionAttributes['_id'];
  district: DistrictAttributes['_id'];
  mop?: MopAttributes['_id'];
  momc?: MomcAttributes['_id'];
};

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

    stringAddress: {
      type: String,
      required: true,
    },
    region: { type: Number, ref: 'Region', required: true },
    district: { type: Number, ref: 'District', required: true },
    mop: { type: Number, ref: 'Mop' },
    momc: { type: Number, ref: 'Momc' },

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
