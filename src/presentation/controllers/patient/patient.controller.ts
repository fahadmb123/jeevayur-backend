import type { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { GetPatientsUseCase } from '../../../application/use-cases/patient/getPatients.useCase.js';
import { CreatePatientUseCase } from '../../../application/use-cases/patient/createPatient.useCase.js';
import { Logger } from '../../../shared/logging/Logger.js';

@injectable()
export class PatientController {
  constructor(
    private readonly getPatientsUseCase: GetPatientsUseCase,
    private readonly createPatientUseCase?: CreatePatientUseCase
  ) {}

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

  public createPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!this.createPatientUseCase) {
        res.status(501).json({ success: false, message: 'Not implemented' });
        return;
      }
      const created = await this.createPatientUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        message: 'Patient registered successfully.',
        data: { patient: created },
      });
    } catch (error) {
      Logger.error('[PatientController] Failed to create patient:', error);
      next(error);
    }
  };
}
