import { validateCompanyAccessToken } from '@utils/company-auth';

import { Staff } from '../company-user';

export function validateUserAccessToken(this: Staff, token: string) {
  const payload = validateCompanyAccessToken(token);

  if (payload?.userId === this.id) return payload;
}
