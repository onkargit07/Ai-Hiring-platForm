import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getPaginatedResults = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where: any = {},
  { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }: PaginationParams,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  include?: any
) => {
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include,
    }),
    model.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    },
  };
};

// Pagination middleware
export const paginate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // Max 100
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

  req.pagination = {
    page,
    limit,
    sortBy,
    sortOrder,
  };

  next();
};
