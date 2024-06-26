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
  staff?: Staff['_id'] | null;
  service: Service['_id'];
  start: Date;
  end: Date;
  cancelledAt?: Date;
} & (
  | {
      existingCustomer?: never;
      customCustomer?: {
        name?: string;
        email?: string;
        phone?: string;
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
      required: false,
      default: null,
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
    cancelledAt: {
      type: Date,
    },
    existingCustomer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    customCustomer: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

// used by main dashboard in administration and by get available slots
schema.index(
  { start: 1, end: 1, venue: 1, staff: 1 },
  { name: 'get_bookings_and_available_slots' },
);

// used for listing user's active bookings
schema.index({ user: 1, start: 1 }, { name: 'list_users_active_bookings' });

export const Booking = mongoose.model<BookingAttributes, BookingModel>(
  'Booking',
  schema,
  'bookings',
);
