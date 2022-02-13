import { validateAccessToken } from '@utils/auth';

import { User } from '../user';

export function validateUserAccessToken(this: User, token: string) {
  const payload = validateAccessToken(token);

  if (payload?.id === this.id) return payload;
}
