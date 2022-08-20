import { Schema, Model, HydratedDocument } from 'mongoose';

import { pointSchema } from '@models/shared/point';
import { RegionAttributes } from '@models/region';

import { Point } from '../types';
import { mongoose } from '..';

export type DistrictAttributes = {
  _id: number;
  name: string;
  point: Point;
  region: RegionAttributes['_id'];
};

type DistrictModel = Model<DistrictAttributes>;

export type District = HydratedDocument<DistrictAttributes>;

const schema = new Schema<DistrictAttributes, DistrictModel>(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    point: pointSchema,

    region: {
      type: Number,
      ref: 'Region',
      required: true,
    },
  },
  { timestamps: true },
);

// used for look up by name
schema.index({ name: 1 });

export const District = mongoose.model<DistrictAttributes, DistrictModel>(
  'District',
  schema,
  'districts',
);
