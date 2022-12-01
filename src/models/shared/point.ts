import { mongoose } from '..';

export type Point = {
  type: 'Point';
  coordinates: [number, number];
};

export const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false },
);
