import { validateCompanyRefreshToken } from '@utils/company-auth';

import { Staff } from '../staff';

export function validateUserRefreshToken(this: Staff, token: string) {
  const payload = validateCompanyRefreshToken(token);
  if (payload?.userId === this.id) return payload;
}