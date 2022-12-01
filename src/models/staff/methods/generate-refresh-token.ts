import { sign } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { Staff } from '../staff';
import { CompanyRefreshTokenPayload } from '@utils/company-auth';

export function generateRefreshToken(this: Staff) {
  const payload: CompanyRefreshTokenPayload = {
    staffId: this.id,
    company: this.company.toString(),
  };

  const generatedToken = sign(
    payload,
    config.get(CONFIG_KEYS.REFRESH_TOKEN_SECRET),
    { expiresIn: config.get(CONFIG_KEYS.REFRESH_EXPIRATION_DURATION) },
  );
  return generatedToken;
}
