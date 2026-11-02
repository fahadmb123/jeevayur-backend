import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/app.error.js';
import { StatusMessage } from '../errors/status.mapper.js';

export const validateBody = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction): void => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    next(new AppError(StatusMessage.BAD_REQUEST, 'Request validation failed', result.error.flatten().fieldErrors));
    return;
  }
  req.body = result.data;
  next();
};
