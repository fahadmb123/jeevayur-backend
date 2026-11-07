import type { NextFunction, Request, Response, RequestHandler } from 'express';
import { ApplicationError } from '../errors/applicationError.js';

export function roleMiddleware(...allowedRoles: string[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      next(new ApplicationError('UNAUTHORIZED', 'Authentication required', 'AUTHENTICATION'));
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      next(new ApplicationError('FORBIDDEN', 'Access forbidden', 'AUTHORIZATION'));
      return;
    }

    next();
  };
}

export const requireRole = roleMiddleware;
