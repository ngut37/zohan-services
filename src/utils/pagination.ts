import { Joi } from 'koa-joi-router';

export type PaginationQuery = { page: string; limit: string };

export const paginationQuerySchema = {
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
};
