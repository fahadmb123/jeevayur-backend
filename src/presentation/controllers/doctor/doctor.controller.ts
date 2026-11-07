import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import type { IUseCase } from '../../../shared/interfaces/use-cases/IUseCase.js';
import type { DoctorDashboardResponseDto } from '../../../application/dtos/doctor/response/doctorDashboard.dto.js';

export class DoctorController extends BaseController {
  constructor(
    private readonly _getDashboardUseCase: IUseCase<void, DoctorDashboardResponseDto>
  ) {
    super();
  }

  getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this._getDashboardUseCase.execute();
      this.sendSuccess(res, 'Doctor dashboard data retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  };
}

