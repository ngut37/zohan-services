import { Schema, Model, HydratedDocument } from 'mongoose';

import { pointSchema } from '@models/shared/point';
import { MopAttributes } from '@models/mop';

import { Point } from '../types';
import { mongoose } from '..';

export type MomcAttributes = {
  _id: number;
  name: string;
  point: Point;
  mop: MopAttributes['_id'];
};

type MomcModel = Model<MomcAttributes>;

export type Momc = HydratedDocument<MomcAttributes>;

const schema = new Schema<MomcAttributes, MomcModel>(
  {
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    point: pointSchema,

    mop: {
      type: Number,
      ref: 'Mop',
      required: true,
    },
  },
  { timestamps: true },
);

// used for look up by name
schema.index({ name: 1 });

export const Momc = mongoose.model<MomcAttributes, MomcModel>(
  'Momc',
  schema,
  'momcs',
);
