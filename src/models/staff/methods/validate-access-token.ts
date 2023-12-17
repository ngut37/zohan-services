import { validateCompanyAccessToken } from '@utils/auth/company-auth';

import { Staff } from '../staff';

export function validateUserAccessToken(this: Staff, token: string) {
  const payload = validateCompanyAccessToken(token);

  if (payload?.staffId === this.id) return payload;
}
