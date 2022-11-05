// ! Not used, since auth rework (roles only for compoany users)

// import { Middleware, ParameterizedContext } from 'koa';
// import jwtMiddleware from 'koa-jwt';

// import { Role } from '@models/users/types';
// import { AccessTokenPayload, extendAuth } from '@utils/auth';
// import { config } from '@config/config';
// import { CONFIG_KEYS } from '@config/keys';

// export type ProtectRouteMiddlewareOptions = {
//   allowUnauthorized?: boolean;
//   allowedRoles?: Role[];
// };

// export const protectRouteMiddleware = (
//   protectOptions: ProtectRouteMiddlewareOptions,
// ): [Middleware, Middleware<{ auth?: AccessTokenPayload }>] => {
//   return [
//     jwtMiddleware({
//       secret: config.get(CONFIG_KEYS.ACCESS_TOKEN_SECRET),
//       passthrough: true,
//       key: 'auth',
//     }),
//     (ctx<{ auth?: AccessTokenPayload }>, next) => {
//       const { allowUnauthorized, allowedRoles } = protectOptions;

//       // no auth provided
//       if (!ctx.state.auth) {
//         if (!allowUnauthorized) return ctx.throw(401);
//         else return next();
//       }

//       const auth = extendAuth(ctx.state.auth);

//       // roles check
//       if (allowedRoles?.length) {
//         // disallow when auth doesn't have at least single allowed role
//         if (!auth.hasOneOfRoles(allowedRoles)) return ctx.throw(401);
//       }

//       ctx.state.auth = auth;

//       return next();
//     },
//   ];
// };
