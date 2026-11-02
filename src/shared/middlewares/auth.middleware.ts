import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app.error.js';
import type { JwtTokenService } from '../../infrastructure/services/jwtToken.service.js';
import type { UserRole } from '../../domain/enums/userRole.enum.js';

function extractToken(req: Request, cookieName: string): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const [scheme, token] = authHeader.split(' ');
    if (scheme && scheme.toLowerCase() === 'bearer' && token) {
      return token.trim();
    }
  }

  const cookieToken = req.cookies?.[cookieName] || req.signedCookies?.[cookieName];
  if (typeof cookieToken === 'string' && cookieToken.trim().length > 0) {
    return cookieToken.trim();
  }

  return null;
}

export const createAuthMiddleware = (tokens: JwtTokenService, cookieName: string) => (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req, cookieName);
  if (!token) {
    next(new AppError('Authentication required', 401));
    return;
  }
  try {
    req.auth = tokens.verify(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const requireRole = (...roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.auth) {
    next(new AppError('Authentication required', 401));
    return;
  }
  if (!roles.includes(req.auth.role)) {
    next(new AppError('Access forbidden', 403));
    return;
  }
  next();
};
