import { Schema, Model, HydratedDocument } from 'mongoose';

import { Venue } from '@models/venue';
import { Staff } from '@models/staff';

import { mongoose } from '..';
import {
  ServiceName,
  ServiceType,
  SERVICE_NAMES,
  SERVICE_TYPES,
} from './types';

export type ServiceAttributes = {
  _id: number;
  type: ServiceType;
  name: ServiceName;
  venue: Venue['_id'];
  staff: Staff['_id'][];
  length: number;
};

type ServiceModel = Model<ServiceAttributes>;

export type Service = HydratedDocument<ServiceAttributes>;

const schema = new Schema<ServiceAttributes, ServiceModel>(
  {
    type: {
      type: String,
      enum: Object.keys(SERVICE_TYPES),
      required: true,
    },
    name: {
      type: String,
      enum: Object.keys(SERVICE_NAMES),
      required: true,
    },
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    staff: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
      },
    ],
    length: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const Service = mongoose.model<ServiceAttributes, ServiceModel>(
  'Service',
  schema,
  'services',
);
