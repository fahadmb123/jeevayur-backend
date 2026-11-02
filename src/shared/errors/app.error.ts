import { statusMapper, StatusMessage, getStatusCodeFromMessage } from './status.mapper.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly statusMessage: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    statusOrErrorMessage: string,
    errorOrStatusMessage?: string,
    details?: unknown
  ) {
    let resolvedStatusMessage: string = StatusMessage.INTERNAL_SERVER_ERROR;
    let resolvedErrorMessage = statusOrErrorMessage;
    let resolvedStatusCode = 500;

    if (errorOrStatusMessage) {
      if (statusMapper[statusOrErrorMessage] !== undefined) {
        resolvedStatusMessage = statusOrErrorMessage;
        resolvedErrorMessage = errorOrStatusMessage;
        resolvedStatusCode = statusMapper[statusOrErrorMessage];
      } else if (statusMapper[errorOrStatusMessage] !== undefined) {
        resolvedStatusMessage = errorOrStatusMessage;
        resolvedErrorMessage = statusOrErrorMessage;
        resolvedStatusCode = statusMapper[errorOrStatusMessage];
      } else {
        resolvedErrorMessage = errorOrStatusMessage;
        resolvedStatusCode = getStatusCodeFromMessage(statusOrErrorMessage);
      }
    } else {
      resolvedStatusCode = getStatusCodeFromMessage(statusOrErrorMessage);
      resolvedStatusMessage =
        statusMapper[statusOrErrorMessage] !== undefined
          ? statusOrErrorMessage
          : StatusMessage.INTERNAL_SERVER_ERROR;
    }

    super(resolvedErrorMessage);
    this.statusCode = resolvedStatusCode;
    this.statusMessage = resolvedStatusMessage;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
