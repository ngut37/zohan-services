import { enumerate } from '@utils/enumerate';

export const ROLES = enumerate(['service_admin', 'client']);

export type Role = keyof typeof ROLES;

export const GENDERS = enumerate(['male', 'female', 'other']);

export type Gender = keyof typeof GENDERS;

export type HashSaltPair = {
  salt: string;
  hash: string;
};
