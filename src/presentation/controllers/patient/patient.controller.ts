import type { Request, Response, NextFunction } from 'express';
import { GetPatientsUseCase } from '../../../application/use-cases/patient/getPatients.useCase.js';
import { Logger } from '../../../shared/logging/Logger.js';

export class PatientController {
  constructor(private readonly getPatientsUseCase: GetPatientsUseCase) {}

  public getPatients = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.getPatientsUseCase.execute();
      res.status(200).json({
        success: true,
        message: 'Patients retrieved successfully.',
        data: response,
      });
    } catch (error) {
      Logger.error('[PatientController] Failed to get patients:', error);
      next(error);
    }
  };
}

