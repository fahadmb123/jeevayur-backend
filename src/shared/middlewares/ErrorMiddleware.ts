import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import type { EnvironmentConfig } from '../../config/EnvironmentConfig.js';
import { Logger } from '../logging/Logger.js';

export class ErrorMiddleware {
  constructor(private readonly config: EnvironmentConfig) {}

  public handle = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    Logger.error(`[Error] ${statusCode} - ${message}`);
    if (statusCode === 500 && err.stack) {
      Logger.error(err.stack);
    }

    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        ...(err instanceof AppError && err.details ? { details: err.details } : {}),
        ...(this.config.nodeEnv === 'development' && { stack: err.stack }),
      },
    });
  };
}
