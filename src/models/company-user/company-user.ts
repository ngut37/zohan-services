import { Schema, ObjectId, Model, HydratedDocument } from 'mongoose';

import { Password, passwordSchema } from '@models/shared';
import { Company } from '@models/company';

import { Role, roleSchema } from '../shared/roles';
import { mongoose } from '..';

import { assignHashSaltPair } from './methods/generate-hash-salt-pair';
import { validatePassword } from './methods/validate-password';
import { generateAccessToken } from './methods/generate-access-token';
import { validateUserAccessToken } from './methods/validate-access-token';
import { generateRefreshToken } from './methods/generate-refresh-token';
import { validateUserRefreshToken } from './methods/validate-refresh-token';

export type StaffMethods = {
  /**
   * Assigns hash and salt to the password object only.
   * The document is not saved after calling this method.
   */
  assignHashSaltPair: typeof assignHashSaltPair;
  validatePassword: typeof validatePassword;
  generateAccessToken: typeof generateAccessToken;
  validateUserAccessToken: typeof validateUserAccessToken;
  generateRefreshToken: typeof generateRefreshToken;
  validateRefreshToken: typeof validateUserRefreshToken;
};

export type StaffAttributes = {
  _id: ObjectId;
  name: string;
  email: string;
  password: Password;
  roles: Role[];
  company: Company;
};

type StaffModel = Model<StaffAttributes, Record<any, never>, StaffMethods>;

export type Staff = HydratedDocument<StaffAttributes, StaffMethods>;

const schema = new Schema<StaffAttributes, StaffModel, StaffMethods>(
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
    password: { type: passwordSchema, required: true },
    company: {
      type: String,
      ref: 'Company',
      required: true,
    },
    roles: roleSchema,
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

export const Staff = mongoose.model<StaffAttributes, StaffModel>(
  'Staff',
  schema,
  'staff',
);
