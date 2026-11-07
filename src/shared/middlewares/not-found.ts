import type { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../errors/applicationError.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApplicationError('NOT_FOUND', `Cannot ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}
