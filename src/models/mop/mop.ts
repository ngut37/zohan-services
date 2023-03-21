import { Schema, Model, HydratedDocument } from 'mongoose';

import { pointSchema } from '@models/shared/point';
import { DistrictAttributes } from '@models/district';

import { Point } from '../types';
import { mongoose } from '..';

export type MopAttributes = {
  _id: number;
  name: string;
  point: Point;
  district: DistrictAttributes['_id'];
};

type MopModel = Model<MopAttributes>;

export type Mop = HydratedDocument<MopAttributes>;

const schema = new Schema<MopAttributes, MopModel>(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    point: pointSchema,

    district: {
      type: Number,
      ref: 'District',
      required: true,
    },
  },
  { timestamps: true },
);

export const Mop = mongoose.model<MopAttributes, MopModel>(
  'Mop',
  schema,
  'mops',
);
