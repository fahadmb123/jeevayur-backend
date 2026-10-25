import type { Response } from 'express';
import { sendCreated, sendError, sendOk } from '../http/response.js';

export abstract class BaseController {
  protected sendOk<T>(res: Response, data: T): void {
    sendOk(res, data);
  }

  protected sendCreated<T>(res: Response, data: T): void {
    sendCreated(res, data);
  }

  protected sendError(res: Response, message: string, statusCode = 500): void {
    sendError(res, message, statusCode);
  }
}
