import { validateCompanyAccessToken } from '@utils/company-auth';

import { CompanyUser } from '../company-user';

export function validateUserAccessToken(this: CompanyUser, token: string) {
  const payload = validateCompanyAccessToken(token);

  if (payload?.userId === this.id) return payload;
}
