import { CompanyUser } from '@models/company-user';
import { Schema, Document } from 'mongoose';

import { mongoose } from '..';

export type CompanyAttributes = {
  _id: string; // ICO
  name: string;
  residence: string;
  dic?: string;
  users: CompanyUser[];
};

export type Company = CompanyAttributes & Document;

const schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
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
    users: { type: String, ref: 'CompanyUser', default: [] },
  },
  { timestamps: true },
);

// indexes
schema.index({ ico: 1 });

export const Company = mongoose.model<Company>('Company', schema, 'companies');
