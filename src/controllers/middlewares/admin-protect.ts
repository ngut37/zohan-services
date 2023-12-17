import { Middleware } from 'koa';
import jwtMiddleware from 'koa-jwt';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { Role } from '@models/shared/roles';
import { Staff } from '@models/staff';
import { Company } from '@models/company';

import {
  CompleteCompanyAccessTokenPayload,
  extendAuth,
  validateCompanyAccessToken,
} from '@utils/auth/company-auth';
import { assertNonNullish } from '@utils/assert-non-nullish';

export type ProtectRouteMiddlewareOptions = {
  allowUnauthorized?: boolean;
  allowedRoles?: Role[];
};

/**
 *
 * Handles access token from Authorization header.
 * Looks up staff and company from database and appends it to `ctx.state.auth`.
 *
 * @param protectOptions
 * @returns
 */
export const adminProtectRouteMiddleware = (
  protectOptions: ProtectRouteMiddlewareOptions = { allowUnauthorized: false },
): [
  Middleware,
  Middleware<{
    auth?: CompleteCompanyAccessTokenPayload;
  }>,
] => {
  const { allowUnauthorized, allowedRoles } = protectOptions;

  return [
    jwtMiddleware({
      secret: config.get(CONFIG_KEYS.ADMIN_ACCESS_TOKEN_SECRET),
      key: 'auth',
      passthrough: allowUnauthorized,
    }),
    async (ctx, next) => {
      // if passthrough is false, JWT has to be valid at this point
      try {
        assertNonNullish(ctx.state.auth);
      } catch (err) {
        if (!allowUnauthorized) return ctx.throw(401, 'Invalid access token');

        const header = ctx.headers.authorization;
        if (!header) return next();
        const [type, token] = header.split(' ');
        if (type !== 'Bearer') return next();
        if (!token) return next();

        const decodedToken = validateCompanyAccessToken(token, {
          ignoreExpiration: true,
        });

        if (!decodedToken) return next();

        ctx.state.auth = {
          ...(decodedToken as CompleteCompanyAccessTokenPayload), // JWT payload
        };
      }

      const extendedAuth = extendAuth(ctx.state.auth);

      const staff = await Staff.findById(extendedAuth.staffId).populate<{
        company: Company;
      }>('company');

      if (!allowUnauthorized) {
        if (!staff) return ctx.throw(401); // staff not found
        if (!staff.company) return ctx.throw(401); // staff's company not found
        if (staff.company.id !== extendedAuth.company) return ctx.throw(401); // token payload company ID does not match staff company ID
      }

      // roles check
      if (allowedRoles?.length && !allowUnauthorized) {
        // disallow when auth doesn't have at least single allowed role
        if (!extendedAuth.hasOneOfRoles(allowedRoles))
          return ctx.throw(
            401,
            `You have restricted permissions to the resource.`,
          );
      }

      ctx.state.auth = {
        ...ctx.state.auth, // JWT payload
        ...extendedAuth, // methods
        staff: staff as unknown as Staff, // staff Mongo-document
      };

      // TODO: use fetched staff to set ctx.state.auth

      return next();
    },
  ];
};
