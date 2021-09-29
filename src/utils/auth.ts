import { verify, VerifyOptions } from 'jsonwebtoken';

import { Role } from '@models/users/types';
import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

export type RefreshTokenPayload = {
  userId: string;
};

export type AccessTokenPayload = RefreshTokenPayload & {
  roles: Role[];
};

export type AuthUtils = {
  hasRole: (this: ExtendedAccessTokenPayload, role: Role) => boolean;
  hasOneOfRoles: (this: ExtendedAccessTokenPayload, roles: Role[]) => boolean;
};

export type ExtendedAccessTokenPayload = AccessTokenPayload & AuthUtils;

export const validateAccessToken = (
  token: string,
  verifyOptions?: VerifyOptions,
) => {
  try {
    const payload = verify(
      token,
      config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
      verifyOptions,
    ) as AccessTokenPayload;
    return payload;
  } catch {
    return undefined;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    const payload = verify(
      token,
      config.get(CONFIG_KEYS.REFRESH_TOKEN_SECRET),
    ) as AccessTokenPayload;
    return payload;
  } catch {
    return undefined;
  }
};

export const authUtils: AuthUtils = {
  hasRole: function (role: Role) {
    return this.roles.includes(role);
  },
  hasOneOfRoles: function (roles: Role[]) {
    return roles.some((role: Role) => this.roles.includes(role));
  },
};

export const extendAuth = (
  auth: AccessTokenPayload,
): ExtendedAccessTokenPayload => {
  return Object.assign(auth, authUtils);
};
