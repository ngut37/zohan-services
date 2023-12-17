import { validateRefreshToken } from '@utils/auth/user-auth';

import { User } from '../user';

export function validateUserRefreshToken(this: User, token: string) {
  const payload = validateRefreshToken(token);
  if (payload?.id === this.id) return payload;
}
