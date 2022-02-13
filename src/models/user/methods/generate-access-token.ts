import { sign } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { AccessTokenPayload } from '@utils/auth';

import { User } from '../user';

export function generateAccessToken(this: User) {
  const payload: AccessTokenPayload = {
    id: this.id,
    name: this.name,
    email: this.email,
    phoneNumber: this.phoneNumber,
    oAuth: this.oAuth,
    avatarUrl: this.avatarUrl,
  };

  const generatedToken = sign(
    payload,
    config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
    { expiresIn: config.get(CONFIG_KEYS.ACCESS_TOKEN_EXPIRATION_DURATION) },
  );

  return generatedToken;
}
