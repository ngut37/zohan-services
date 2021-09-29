import { sign } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { User } from '../user';
import { RefreshTokenPayload } from '@utils/auth';

export function generateRefreshToken(this: User) {
  const payload: RefreshTokenPayload = { userId: this.id };

  const generatedToken = sign(
    payload,
    config.get(CONFIG_KEYS.REFRESH_TOKEN_SECRET),
    { expiresIn: config.get(CONFIG_KEYS.REFRESH_EXPIRATION_DURATION) },
  );
  return generatedToken;
}
