import { sign } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { CompanyAccessTokenPayload } from '@utils/company-auth';

import { Staff } from '../staff';

export function generateAccessToken(this: Staff) {
  const payload: CompanyAccessTokenPayload = {
    staffId: this.id,
    name: this.name,
    email: this.email,
    role: this.role,
    company: this.company,
  };

  const generatedToken = sign(
    payload,
    config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
    { expiresIn: config.get(CONFIG_KEYS.ACCESS_TOKEN_EXPIRATION_DURATION) },
  );
  return generatedToken;
}
