import type { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../errors/applicationError.js';
import { mapKindToHttpStatus } from '../errors/http-error.mapper.js';
import { Logger } from '../logging/Logger.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApplicationError) {
    const statusCode = mapKindToHttpStatus(err.kind);
    res.status(statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  Logger.error('Unhandled Server Error', err);
  const rawMsg = err instanceof Error ? err.message : '';
  const isNetworkFailure =
    rawMsg.includes('fetch failed') ||
    rawMsg.includes('ECONNREFUSED') ||
    rawMsg.includes('ETIMEDOUT') ||
    rawMsg.includes('ENOTFOUND');

  const clientMsg = isNetworkFailure
    ? 'Database or remote service connection failed. Please verify network access and retry.'
    : err instanceof Error
      ? err.message
      : 'An unexpected internal server error occurred';

  res.status(500).json({
    success: false,
    message: clientMsg,
    errors: null,
  });
}

