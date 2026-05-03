import type { Request } from 'express';
import type { IPaginationMeta } from '@global/helpers/response.handler';

export interface IPaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPaginationParams(req: Request): IPaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(page: number, limit: number, total: number): IPaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
