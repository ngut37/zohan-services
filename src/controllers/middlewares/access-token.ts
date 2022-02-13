import { Middleware, ParameterizedContext } from 'koa';

import { AccessTokenPayload, validateAccessToken } from '@utils/auth';

export type ProtectRouteMiddlewareOptions = {
  allowUnauthorized?: boolean;
};

export const protectRouteMiddleware = (
  protectOptions: ProtectRouteMiddlewareOptions,
): [Middleware, Middleware<{ auth?: AccessTokenPayload }>] => {
  return [
    (ctx: ParameterizedContext, next) => {
      const accessToken = ctx.cookies.get('access_token');

      if (!accessToken) {
        return ctx.throw(401);
      }

      // validate and extract access token payload
      const accessTokenPayload = validateAccessToken(accessToken, {
        ignoreExpiration: true,
      });

      if (!accessTokenPayload) {
        return ctx.throw(401);
      }

      ctx.state.auth = accessTokenPayload;

      return next();
    },
    (ctx: ParameterizedContext<{ auth?: AccessTokenPayload }>, next) => {
      const { allowUnauthorized } = protectOptions;

      // no auth provided
      if (!ctx.state.auth) {
        if (!allowUnauthorized) return ctx.throw(401);
        else return next();
      }

      return next();
    },
  ];
};
