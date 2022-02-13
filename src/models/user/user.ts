import mongoose, { Schema, Document } from 'mongoose';

import { assignHashSaltPair } from './methods/generate-hash-salt-pair';
import { validatePassword } from './methods/validate-password';
import { generateAccessToken } from './methods/generate-access-token';
import { validateUserAccessToken } from './methods/validate-access-token';
import { generateRefreshToken } from './methods/generate-refresh-token';
import { validateUserRefreshToken } from './methods/validate-refresh-token';

import { OAuthType, O_AUTH_TYPES, Password } from './types';

export type UserAttributes = {
  name: string;
  email: string;
  phoneNumber: string;
  password?: Password;
  oAuth?: {
    userId: string;
    type: OAuthType;
  };
  avatarUrl?: string;
};

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

export type User = UserAttributes & UserMethods & Document;

const schema: Schema<UserMethods> = new Schema(
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
    password: {
      hash: String,
      salt: String,
    },
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

export const User = mongoose.model<User>('User', schema, 'users');
