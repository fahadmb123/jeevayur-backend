import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApplicationError } from '../errors/applicationError.js';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: {
  windowMs?: number;
  max?: number;
} = {}): RequestHandler {
  const windowMs = options.windowMs ?? 15 * 60 * 1000;
  const max = options.max ?? 100;
  const hits = new Map<string, RateLimitStore>();

  return (req: Request, _res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const clientRecord = hits.get(ip);

    if (!clientRecord || now > clientRecord.resetTime) {
      hits.set(ip, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    clientRecord.count += 1;
    if (clientRecord.count > max) {
      next(
        new ApplicationError(
          'RATE_LIMIT_EXCEEDED',
          'Too many requests, please try again later',
          'VALIDATION'
        )
      );
      return;
    }

    next();
  };
}

export const rateLimiter = createRateLimiter();
