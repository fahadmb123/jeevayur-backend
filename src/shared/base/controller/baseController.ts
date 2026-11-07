import type { Response } from 'express';
import type { ApiResponse } from '../../models/common-response.model.js';

export abstract class BaseController {
  protected sendSuccess<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode = 200
  ): void {
    const payload: ApiResponse<T> & Record<string, unknown> = {
      success: true,
      message,
      data,
      ...(typeof data === 'object' && data !== null && !Array.isArray(data)
        ? (data as Record<string, unknown>)
        : {}),
    };
    res.status(statusCode).json(payload);
  }

  protected sendCreated<T>(res: Response, message: string, data?: T): void {
    this.sendSuccess(res, message, data, 201);
  }

  protected sendNoContent(res: Response): void {
    res.status(204).send();
  }
}
