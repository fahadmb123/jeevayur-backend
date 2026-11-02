import { ErrorStatusMapper } from './errorStatus.mapper.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode ?? ErrorStatusMapper.toStatusCode(message);
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
