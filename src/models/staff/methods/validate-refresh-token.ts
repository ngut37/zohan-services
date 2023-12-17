import { validateCompanyRefreshToken } from '@utils/auth/company-auth';

import { Staff } from '../staff';

export function validateUserRefreshToken(this: Staff, token: string) {
  const payload = validateCompanyRefreshToken(token);
  if (payload?.staffId === this.id) return payload;
}
