import type { Request, Response, NextFunction } from 'express';
import { CreateAppointmentUseCase } from '../../../application/use-cases/appointment/createAppointment.useCase.js';
import { GetAppointmentsUseCase } from '../../../application/use-cases/appointment/getAppointments.useCase.js';
import { UpdateAppointmentStatusUseCase } from '../../../application/use-cases/appointment/updateAppointmentStatus.useCase.js';
import { Logger } from '../../../shared/logging/Logger.js';

export class AppointmentController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly getAppointmentsUseCase?: GetAppointmentsUseCase,
    private readonly updateAppointmentStatusUseCase?: UpdateAppointmentStatusUseCase
  ) {}

  public createAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.createAppointmentUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        message: 'Appointment booking confirmed successfully.',
        data: response,
      });
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
      res.status(200).json({
        success: true,
        message: 'Appointments retrieved successfully.',
        data: response,
      });
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
      res.status(200).json({
        success: true,
        message: 'Appointment status updated successfully.',
        data: response,
      });
    } catch (error) {
      Logger.error('[AppointmentController] Failed to update appointment status:', error);
      next(error);
    }
  };
}
