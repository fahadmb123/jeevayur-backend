import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import type { JwtTokenService } from '../../infrastructure/services/JwtTokenService.js';

export const createAuthMiddleware = (tokens: JwtTokenService, cookieName: string) => (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.[cookieName];
  if (!token) { next(new AppError('Authentication required', 401)); return; }
  try { req.auth = tokens.verify(token); next(); } catch { next(new AppError('Authentication required', 401)); }
};
