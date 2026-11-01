import type { Response } from 'express';

export abstract class BaseController {
  protected sendOk<T>(res: Response, data: T, status = 200): void {
    res.status(status).json(data);
  }

  protected sendCreated<T>(res: Response, data: T): void {
    this.sendOk(res, data, 201);
  }

  protected sendNoContent(res: Response): void {
    res.status(204).send();
  }
}
