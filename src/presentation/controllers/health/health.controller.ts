import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import type { IUseCase } from '../../../shared/interfaces/use-cases/IUseCase.js';
import type { HealthResponseDto } from '../../../application/dtos/health/response/health.dto.js';

export class HealthController extends BaseController {
  constructor(private readonly _checkHealthUseCase: IUseCase<void, HealthResponseDto>) {
    super();
  }

  check = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._checkHealthUseCase.execute();
      this.sendSuccess(res, 'Health status check', data);
    } catch (err) {
      next(err);
    }
  };
}

