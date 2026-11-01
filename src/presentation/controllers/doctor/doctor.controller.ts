import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/controllers/base.controller.js';
import type { ILoginUseCase } from '../../../application/interfaces/use-cases/auth/ILoginUseCase.js';

export class DoctorController extends BaseController {
  constructor(private readonly loginUseCase: ILoginUseCase) {
    super();
  }

  public getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.sendOk(res, {
        stats: {
          activePatients: 24,
          todayConsultations: 6,
          completedTherapies: 142,
          pendingReviews: 3,
        },
        message: 'Doctor dashboard data retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
