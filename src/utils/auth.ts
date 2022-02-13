import { verify, VerifyOptions } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { User } from '@models/user';

export type RefreshTokenPayload = Pick<User, 'id'>;

export type AccessTokenPayload = Pick<
  User,
  'id' | 'name' | 'email' | 'phoneNumber' | 'oAuth' | 'avatarUrl'
>;

export const validateAccessToken = (
  token: string,
  verifyOptions?: VerifyOptions,
) => {
  try {
    const payload = verify(
      token,
      config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
      verifyOptions,
    ) as AccessTokenPayload;
    return payload;
  } catch {
    return undefined;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    const payload = verify(
      token,
      config.get(CONFIG_KEYS.REFRESH_TOKEN_SECRET),
    ) as AccessTokenPayload;
    return payload;
  } catch {
    return undefined;
  }
};
