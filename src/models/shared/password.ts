import { mongoose } from '../';

const { Schema } = mongoose;

export type Password = {
  hash: string;
  salt: string;
};

export const passwordSchema = new Schema(
  {
    hash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  { id: false },
);
