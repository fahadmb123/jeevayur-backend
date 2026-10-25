import type { NextFunction, Request, Response } from 'express';
import { Logger } from '../logging/Logger.js';

export class LoggerMiddleware {
  public static handle(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      Logger.http(req.method, req.originalUrl, res.statusCode, Date.now() - start);
    });

    next();
  }
}
