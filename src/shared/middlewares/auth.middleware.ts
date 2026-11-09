import type { NextFunction, Request, Response, RequestHandler } from 'express';
import { ApplicationError } from '../errors/applicationError.js';
import type { IJwtService, AuthTokenPayload } from '../interfaces/services/IJwtService.js';
import type { ISessionRepository } from '../../domain/repositories/auth/session.repository.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
    }
  }
}

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

export function createAuthMiddleware(
  tokens: IJwtService,
  cookieName: string,
  sessionRepository?: ISessionRepository,
  _refreshCookieName?: string
): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = extractToken(req, cookieName);
    if (!token) {
      next(new ApplicationError('UNAUTHORIZED', 'Authentication required', 'AUTHENTICATION'));
      return;
    }

    try {
      req.auth = tokens.verify(token);

      if (sessionRepository && req.auth?.userId) {
        const userSessions = await sessionRepository.findByUserId(req.auth.userId);
        if (userSessions.length === 0) {
          next(new ApplicationError('SESSION_REVOKED', 'Session has been revoked or signed out', 'AUTHENTICATION'));
          return;
        }
      }

      next();
    } catch {
      next(new ApplicationError('INVALID_TOKEN', 'Invalid or expired token', 'AUTHENTICATION'));
    }
  };
}
