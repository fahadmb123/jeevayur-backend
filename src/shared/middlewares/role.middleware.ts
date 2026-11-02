import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app.error.js';
import { StatusMessage } from '../errors/status.mapper.js';
import type { UserRole } from '../../domain/enums/userRole.enum.js';

export const roleMiddleware = (...roles: UserRole[]) => (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.auth) {
    next(new AppError(StatusMessage.UNAUTHORIZED, 'Authentication required'));
    return;
  }

  if (!roles.includes(req.auth.role)) {
    next(new AppError(StatusMessage.FORBIDDEN, 'Access forbidden'));
    return;
  }

  next();
};

export const requireRole = roleMiddleware;
export const requireDoctor = roleMiddleware('doctor', 'admin');
export const requireAdmin = roleMiddleware('admin');
export const requirePatient = roleMiddleware('patient', 'admin');
