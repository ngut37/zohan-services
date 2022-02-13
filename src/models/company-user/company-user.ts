import { Schema, Document } from 'mongoose';

import { Password, passwordSchema } from '@models/shared';
import { Company } from '@models/company';

import { assignHashSaltPair } from './methods/generate-hash-salt-pair';
import { validatePassword } from './methods/validate-password';
import { generateAccessToken } from './methods/generate-access-token';
import { validateUserAccessToken } from './methods/validate-access-token';
import { generateRefreshToken } from './methods/generate-refresh-token';
import { validateUserRefreshToken } from './methods/validate-refresh-token';

import { mongoose } from '..';

import { Role, ROLES } from './types';

export type CompanyUserAttributes = {
  name: string;
  email: string;
  password: Password;
  roles: Role[];
  company: Company;
};

export type CompanyUserMethods = {
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

export type CompanyUser = CompanyUserAttributes & CompanyUserMethods & Document;

const schema: Schema<CompanyUserMethods> = new Schema(
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
    password: passwordSchema,
    company: {
      type: String,
      ref: 'Company',
      required: true,
    },
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

export const CompanyUser = mongoose.model<CompanyUser>(
  'CompanyUser',
  schema,
  'companyUsers',
);
