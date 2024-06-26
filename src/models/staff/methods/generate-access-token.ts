import { sign } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { Company } from '@models/company';

import { CompanyAccessTokenPayload } from '@utils/auth/company-auth';

import { Staff } from '../staff';

export function generateAccessToken(
  this: Staff & { company: Company | ObjectId },
) {
  const payload: CompanyAccessTokenPayload = {
    staffId: this.id,
    name: this.name,
    email: this.email,
    role: this.role,
    company: (this.company as Company).name
      ? this.company.id
      : this.company.toString(),
  };

  const generatedToken = sign(
    payload,
    config.get(CONFIG_KEYS.ADMIN_ACCESS_TOKEN_SECRET),
    {
      expiresIn: config.get(CONFIG_KEYS.ADMIN_ACCESS_TOKEN_EXPIRATION_DURATION),
    },
  );
  return generatedToken;
}
