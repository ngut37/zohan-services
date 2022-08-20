import { verify, VerifyOptions } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { StaffAttributes } from '@models/company-user';
import { Role } from '@models/shared/roles';

export type CompanyRefreshTokenPayload = {
  userId: string;
};

export type CompanyAccessTokenPayload = CompanyRefreshTokenPayload &
  Pick<StaffAttributes, 'name' | 'email' | 'roles' | 'company'>;

export type CompanyAuthUtils = {
  hasRole: (this: ExtendedCompanyAccessTokenPayload, role: Role) => boolean;
  hasOneOfRoles: (
    this: ExtendedCompanyAccessTokenPayload,
    roles: Role[],
  ) => boolean;
};

export type ExtendedCompanyAccessTokenPayload = CompanyAccessTokenPayload &
  CompanyAuthUtils;

export const validateCompanyAccessToken = (
  token: string,
  verifyOptions?: VerifyOptions,
) => {
  try {
    const payload = verify(
      token,
      config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
      verifyOptions,
    ) as CompanyAccessTokenPayload;
    return payload;
  } catch {
    return undefined;
  }
};

export const validateCompanyRefreshToken = (token: string) => {
  try {
    const payload = verify(
      token,
      config.get(CONFIG_KEYS.REFRESH_TOKEN_SECRET),
    ) as CompanyAccessTokenPayload;
    return payload;
  } catch {
    return undefined;
  }
};

export const authUtils: CompanyAuthUtils = {
  hasRole: function (role: Role) {
    return this.roles.includes(role);
  },
  hasOneOfRoles: function (roles: Role[]) {
    return roles.some((role: Role) => this.roles.includes(role));
  },
};

export const extendAuth = (
  auth: CompanyAccessTokenPayload,
): ExtendedCompanyAccessTokenPayload => {
  return Object.assign(auth, authUtils);
};
