import { Schema, ObjectId, Model, HydratedDocument } from 'mongoose';

import { Timestamps } from '@models/shared/timestamp';
import { Password, passwordSchema } from '@models/shared';

import { mongoose } from '..';

import { assignHashSaltPair } from './methods/generate-hash-salt-pair';
import { validatePassword } from './methods/validate-password';
import { generateAccessToken } from './methods/generate-access-token';
import { validateUserAccessToken } from './methods/validate-access-token';
import { generateRefreshToken } from './methods/generate-refresh-token';
import { validateUserRefreshToken } from './methods/validate-refresh-token';

import { OAuthType, O_AUTH_TYPES } from './types';

export type UserMethods = {
  /**
   *  Assigns hash and salt to the password object only. The document is not saved after this method.
   */
  assignHashSaltPair: typeof assignHashSaltPair;
  validatePassword: typeof validatePassword;
  generateAccessToken: typeof generateAccessToken;
  validateUserAccessToken: typeof validateUserAccessToken;
  generateRefreshToken: typeof generateRefreshToken;
  validateRefreshToken: typeof validateUserRefreshToken;
};

export type UserAttributes = {
  _id: ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  password: Password;
  oAuth?: {
    userId: string;
    type: OAuthType;
  };
  avatarUrl?: string;
} & Timestamps;

type UserModel = Model<UserAttributes, Record<any, never>, UserMethods>;

export type User = HydratedDocument<UserAttributes, UserMethods>;

const schema = new Schema<UserAttributes, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: String,
    password: { type: passwordSchema, required: true },
    oAuth: {
      userId: String,
      type: { type: String, enum: Object.keys(O_AUTH_TYPES) },
    },
    avatarUrl: String,
  },
  { timestamps: true },
);

// indexes
schema.index({ email: 1 });

// methods
schema.method('assignHashSaltPair', assignHashSaltPair);
schema.method('validatePassword', validatePassword);
schema.method('generateAccessToken', generateAccessToken);
schema.method('validateUserAccessToken', validateUserAccessToken);
schema.method('generateRefreshToken', generateRefreshToken);
schema.method('validateRefreshToken', validateUserRefreshToken);

export const User = mongoose.model<UserAttributes, UserModel>(
  'User',
  schema,
  'users',
);
