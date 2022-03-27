import { validateCompanyAccessToken } from '@utils/company-auth';

import { Staff } from '../staff';

export function validateUserAccessToken(this: Staff, token: string) {
  const payload = validateCompanyAccessToken(token);

  if (payload?.userId === this.id) return payload;
}
