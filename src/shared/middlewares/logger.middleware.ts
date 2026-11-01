import type { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/Logger.js';

export class LoggerMiddleware {
  public static handle = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      Logger.http(req.method, req.originalUrl, res.statusCode, duration);
    });
    next();
  };
}

