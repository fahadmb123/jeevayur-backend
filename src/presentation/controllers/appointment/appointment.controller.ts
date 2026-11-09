import type { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import { CreateAppointmentUseCase } from '../../../application/use-cases/appointment/createAppointment.useCase.js';
import { GetAppointmentsUseCase } from '../../../application/use-cases/appointment/getAppointments.useCase.js';
import { UpdateAppointmentStatusUseCase } from '../../../application/use-cases/appointment/updateAppointmentStatus.useCase.js';
import { Logger } from '../../../shared/logging/Logger.js';

@injectable()
export class AppointmentController extends BaseController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly getAppointmentsUseCase?: GetAppointmentsUseCase,
    private readonly updateAppointmentStatusUseCase?: UpdateAppointmentStatusUseCase
  ) {
    super();
  }

  public createAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.createAppointmentUseCase.execute(req.body);
      this.sendCreated(res, 'Appointment booking confirmed successfully.', response);
    } catch (error) {
      Logger.error('[AppointmentController] Failed to create appointment:', error);
      next(error);
    }
  };

  public getAppointments = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!this.getAppointmentsUseCase) {
        throw new Error('GetAppointmentsUseCase not configured');
      }
      const response = await this.getAppointmentsUseCase.execute();
      this.sendSuccess(res, 'Appointments retrieved successfully.', response);
    } catch (error) {
      Logger.error('[AppointmentController] Failed to get appointments:', error);
      next(error);
    }
  };

  public updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!this.updateAppointmentStatusUseCase) {
        throw new Error('UpdateAppointmentStatusUseCase not configured');
      }
      const id = String(req.params.id);
      const { status, reason } = req.body;
      const response = await this.updateAppointmentStatusUseCase.execute(id, status, reason);
      this.sendSuccess(res, 'Appointment status updated successfully.', response);
    } catch (error) {
      Logger.error('[AppointmentController] Failed to update appointment status:', error);
      next(error);
    }
  };
}
