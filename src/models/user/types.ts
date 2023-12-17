import { enumerate } from '@utils/enumerate';

export const USER_STATUS = enumerate([
  /** User has not verified their email address */
  'not_verified',

  /** User has verified their email address */
  'verified',

  /** User has been blocked by an admin */
  'blocked',

  /** User has been disabled by an admin */
  'disabled',
]);

export type UserStatus = keyof typeof USER_STATUS;

export const O_AUTH_TYPES = enumerate(['google', 'facebook']);

export type OAuthType = keyof typeof O_AUTH_TYPES;
