import { verify, VerifyOptions } from 'jsonwebtoken';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { StaffAttributes } from '@models/staff';
import { Role } from '@models/shared/roles';

export type CompanyRefreshTokenPayload = {
  staffId: string;
};

export type CompanyAccessTokenPayload = CompanyRefreshTokenPayload &
  Pick<StaffAttributes, 'name' | 'email' | 'role' | 'company'>;

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
    return this.role === role;
  },
  hasOneOfRoles: function (roles: Role[]) {
    return roles.some((role: Role) => this.role === role);
  },
};

export const extendAuth = (
  auth: CompanyAccessTokenPayload,
): ExtendedCompanyAccessTokenPayload => {
  return Object.assign(auth, authUtils);
};
