import {
  Schema,
  Model,
  HydratedDocument,
  ObjectId,
  // SchemaType
} from 'mongoose';

import { Timestamps } from '@models/shared/timestamp';
// import { StaffAttributes } from '@models/company-user';
import { RegionAttributes } from '@models/region';
import { DistrictAttributes } from '@models/district';
import { Mop } from '@models/mop';
import { Momc } from '@models/momc';

import { mongoose } from '..';

export type CompanyAttributes = {
  _id: ObjectId;
  ico: string;
  name: string;
  residence: string;
  dic?: string;
  // users: StaffAttributes['_id'];

  region: RegionAttributes['_id'];
  district: DistrictAttributes['_id'];
  mop?: Mop['_id'];
  momc?: Momc['_id'];
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
    residence: {
      type: String,
      required: true,
    },

    dic: String,
    region: { type: Number, ref: 'Region', required: true },
    district: { type: Number, ref: 'District', required: true },
    mop: { type: Number, ref: 'Mop' },
    momc: { type: Number, ref: 'Momc' },
    // users: { type: Schema.Types.ObjectId, ref: 'Staff', default: [] },
  },
  { timestamps: true },
);

export const Company = mongoose.model<CompanyAttributes, CompanyModel>(
  'Company',
  schema,
  'companies',
);
