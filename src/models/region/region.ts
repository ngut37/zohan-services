import { Schema, Model, HydratedDocument } from 'mongoose';

import { pointSchema } from '@models/shared/point';

import { Point } from '../types';
import { mongoose } from '..';

export type RegionAttributes = {
  _id: number;
  name: string;
  point: Point;
};

type RegionModel = Model<RegionAttributes>;

export type Region = HydratedDocument<RegionAttributes>;

const schema = new Schema<RegionAttributes, RegionModel>(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    point: pointSchema,
  },
  { timestamps: true },
);

export const Region = mongoose.model<RegionAttributes, RegionModel>(
  'Region',
  schema,
  'regions',
);
