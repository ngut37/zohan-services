import { sign } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { CompanyAccessTokenPayload } from '@utils/company-auth';

import { CompanyUser } from '../company-user';

export function generateAccessToken(this: CompanyUser) {
  const payload: CompanyAccessTokenPayload = {
    userId: this.id,
    name: this.name,
    email: this.email,
    roles: this.roles,
    company: this.company,
  };

  const generatedToken = sign(
    payload,
    config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
    { expiresIn: config.get(CONFIG_KEYS.ACCESS_TOKEN_EXPIRATION_DURATION) },
  );
  return generatedToken;
}
