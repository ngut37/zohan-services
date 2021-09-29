import mongoose, { Schema, Document } from 'mongoose';

import { assignHashSaltPair } from './methods/generate-hash-salt-pair';
import { validatePassword } from './methods/validate-password';
import { generateAccessToken } from './methods/generate-access-token';
import { validateUserAccessToken } from './methods/validate-access-token';
import { generateRefreshToken } from './methods/generate-refresh-token';
import { validateUserRefreshToken } from './methods/validate-refresh-token';

import { Gender, GENDERS, Role, ROLES } from './types';

export type UserAttributes = {
  firstName: string;
  lastName: string;
  email: string;
  password: {
    hash: string;
    salt: string;
  };
  birthDate: Date;
  gender: Gender;
  roles: Role[];
};

export type UserMethods = {
  /**
   *  Assigns hash and salt to the password object only. The document is not saved during this method.
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
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      hash: {
        type: String,
        required: true,
      },
      salt: {
        type: String,
        required: true,
      },
    },
    birthDate: Date,
    gender: { type: String, enum: Object.keys(GENDERS) },
    roles: { type: [String], enum: Object.keys(ROLES) },
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
