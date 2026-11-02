import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app.error.js';
import { StatusMessage } from '../errors/status.mapper.js';
import type { JwtTokenService } from '../../infrastructure/services/jwtToken.service.js';

export { requireRole, roleMiddleware } from './role.middleware.js';

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

export const createAuthMiddleware = (tokens: JwtTokenService, cookieName: string) => (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req, cookieName);
  if (!token) {
    next(new AppError(StatusMessage.UNAUTHORIZED, 'Authentication required'));
    return;
  }
  try {
    req.auth = tokens.verify(token);
    next();
  } catch {
    next(new AppError(StatusMessage.UNAUTHORIZED, 'Invalid or expired token'));
  }
};
