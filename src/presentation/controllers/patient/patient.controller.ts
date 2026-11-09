import type { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import { GetPatientsUseCase } from '../../../application/use-cases/patient/getPatients.useCase.js';
import { CreatePatientUseCase } from '../../../application/use-cases/patient/createPatient.useCase.js';
import { Logger } from '../../../shared/logging/Logger.js';

@injectable()
export class PatientController extends BaseController {
  constructor(
    private readonly getPatientsUseCase: GetPatientsUseCase,
    private readonly createPatientUseCase?: CreatePatientUseCase
  ) {
    super();
  }

  public getPatients = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.getPatientsUseCase.execute();
      this.sendSuccess(res, 'Patients retrieved successfully.', response);
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
        this.sendBadRequest(res, 'Not implemented');
        return;
      }
      const created = await this.createPatientUseCase.execute(req.body);
      this.sendCreated(res, 'Patient registered successfully.', { patient: created });
    } catch (error) {
      Logger.error('[PatientController] Failed to create patient:', error);
      next(error);
    }
  };
}
