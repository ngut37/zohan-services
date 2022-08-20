import { enumerate } from '@utils/enumerate';

export const ROLES = enumerate(['admin', 'editor', 'reader']);

export type Role = keyof typeof ROLES;

export const roleSchema = { type: [String], enum: Object.keys(ROLES) };
