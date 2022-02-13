import { validateCompanyRefreshToken } from '@utils/company-auth';

import { CompanyUser } from '../company-user';

export function validateUserRefreshToken(this: CompanyUser, token: string) {
  const payload = validateCompanyRefreshToken(token);
  if (payload?.userId === this.id) return payload;
}
