import { validateRefreshToken } from '@utils/auth';

import { User } from '../user';

export function validateUserRefreshToken(this: User, token: string) {
  const payload = validateRefreshToken(token);
  if (payload?.userId === this.id) return payload;
}
