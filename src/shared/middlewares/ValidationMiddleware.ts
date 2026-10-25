import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/AppError.js';

export const validateBody = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    next(new AppError('Request validation failed', 400, true, result.error.flatten().fieldErrors));
    return;
  }
  req.body = result.data;
  next();
};
