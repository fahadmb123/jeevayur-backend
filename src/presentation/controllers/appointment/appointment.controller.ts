import type { Request, Response, NextFunction } from 'express';
import { CreateAppointmentUseCase } from '../../../application/use-cases/appointment/createAppointment.useCase.js';
import { Logger } from '../../../shared/logging/Logger.js';

export class AppointmentController {
  constructor(private readonly createAppointmentUseCase: CreateAppointmentUseCase) {}

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
}
