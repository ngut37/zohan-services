import { Schema, Model, HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

import { Venue } from '@models/venue';
import { Staff } from '@models/staff';
import { Service } from '@models/service';
import { User } from '@models/user';

import { mongoose } from '..';

export type BookingAttributes = {
  _id: ObjectId;
  venue: Venue['_id'];
  staff: Staff['_id'];
  service: Service['_id'];
  start: Date;
  end: Date;
} & (
  | {
      existingCustomer?: never;
      customCustomer?: {
        name: string;
        email: string;
        phone: string;
      };
    }
  | {
      existingCustomer?: User['_id'];
      customCustomer?: never;
    }
);

type BookingModel = Model<BookingAttributes>;

export type Booking = HydratedDocument<BookingAttributes>;

const schema = new Schema<BookingAttributes, BookingModel>(
  {
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    existingCustomer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    customCustomer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      required: false,
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model<BookingAttributes, BookingModel>(
  'Booking',
  schema,
  'bookings',
);
