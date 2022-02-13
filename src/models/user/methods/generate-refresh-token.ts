import { sign } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { RefreshTokenPayload } from '@utils/auth';

import { User } from '../user';

export function generateRefreshToken(this: User) {
  const payload: RefreshTokenPayload = { id: this.id };

  const generatedToken = sign(
    payload,
    config.get(CONFIG_KEYS.REFRESH_TOKEN_SECRET),
    { expiresIn: config.get(CONFIG_KEYS.REFRESH_EXPIRATION_DURATION) },
  );

  return generatedToken;
}
