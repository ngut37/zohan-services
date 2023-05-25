import { Middleware } from 'koa';
import jwtMiddleware from 'koa-jwt';

import { assertNonNullish } from '@utils/assert-non-nullish';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';

import { CompleteAccessTokenPayload, validateAccessToken } from '@utils/auth';
import { User } from '@models/user';

export type ProtectRouteMiddlewareOptions = {
  allowUnauthorized?: boolean;
};

export const protectRouteMiddleware = (
  protectOptions: ProtectRouteMiddlewareOptions = { allowUnauthorized: false },
): [
  Middleware,
  Middleware<{
    auth?: CompleteAccessTokenPayload;
  }>,
] => {
  const { allowUnauthorized } = protectOptions;

  return [
    jwtMiddleware({
      secret: config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
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

        const decodedToken = validateAccessToken(token, {
          ignoreExpiration: true,
        });

        if (!decodedToken) return next();

        ctx.state.auth = {
          ...(decodedToken as CompleteAccessTokenPayload), // JWT payload
        };
      }

      const user = await User.findById(ctx.state.auth.id);

      if (!allowUnauthorized) {
        if (!user) return ctx.throw(401); // staff not found
      }

      ctx.state.auth = {
        ...ctx.state.auth,
        user: user as unknown as User,
      };

      // TODO: use fetched staff to set ctx.state.auth

      return next();
    },
  ];
};
