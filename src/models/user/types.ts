import { enumerate } from '@utils/enumerate';

export const O_AUTH_TYPES = enumerate(['google', 'facebook']);

export type OAuthType = keyof typeof O_AUTH_TYPES;

export type Password = {
  hash: string;
  salt: string;
};
