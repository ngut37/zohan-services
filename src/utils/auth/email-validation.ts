import { verify, VerifyOptions } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { User } from '@models/user';

export type EmailVerificationTokenPayload = Pick<User, 'id'>;

export const validateEmailVerificationToken = (
  token: string,
  verifyOptions?: VerifyOptions,
) => {
  try {
    const payload = verify(
      token,
      config.get(CONFIG_KEYS.RESET_TOKEN_SECRET),
      verifyOptions,
    ) as EmailVerificationTokenPayload;
    return payload;
  } catch {
    return undefined;
  }
};
