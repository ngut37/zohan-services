import { sign } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { EmailVerificationTokenPayload } from '@utils/auth/email-validation';

import { User } from '../user';

export function generateEmailValidationToken(this: User): string {
  const payload: EmailVerificationTokenPayload = {
    id: this.id,
  };

  const generatedToken = sign(
    payload,
    config.get(CONFIG_KEYS.RESET_TOKEN_SECRET),
    { expiresIn: config.get(CONFIG_KEYS.RESET_TOKEN_EXPIRATION_DURATION) },
  );

  return generatedToken;
}
