import { Middleware } from 'koa';
import jwtMiddleware from 'koa-jwt';

import { assertNonNullish } from '@utils/assert-non-nullish';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { User, UserStatus } from '@models/user';

import {
  CompleteAccessTokenPayload,
  validateAccessToken,
} from '@utils/auth/user-auth';

export type ProtectRouteMiddlewareOptions = {
  allowUnauthorized?: boolean;
  allowStatuses?: UserStatus[];
};

export const protectRouteMiddleware = (
  protectOptions: ProtectRouteMiddlewareOptions = {
    allowUnauthorized: false,
    allowStatuses: ['verified'],
  },
): [
  Middleware,
  Middleware<{
    auth?: CompleteAccessTokenPayload;
  }>,
] => {
  const allowUnauthorized = protectOptions.allowUnauthorized ?? false;
  const { allowStatuses } = protectOptions;

  return [
    jwtMiddleware({
      secret: config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
      key: 'auth',
      passthrough: allowUnauthorized,
    }),
    async (ctx, next) => {
      if (allowUnauthorized) return next();

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

        const decodedToken = validateAccessToken(token, {
          ignoreExpiration: true,
        });

        if (!decodedToken) return next();

        ctx.state.auth = {
          ...(decodedToken as CompleteAccessTokenPayload), // JWT payload
        };
      }

      const user = await User.findById(ctx.state.auth.id);

      if (!allowUnauthorized && !user) {
        return ctx.throw(401, 'User not found');
      }

      if (allowStatuses && allowStatuses.length > 0) {
        const { status } = ctx.state.auth;

        if (!status) {
          return ctx.throw(401, 'User status not found');
        }

        if (!allowStatuses.includes(status)) {
          return ctx.throw(403, `User status "${status}" not allowed`);
        }
      }

      ctx.state.auth = {
        ...ctx.state.auth,
        user: user as unknown as User,
      };

      // TODO: use fetched user to set ctx.state.auth

      return next();
    },
  ];
};
