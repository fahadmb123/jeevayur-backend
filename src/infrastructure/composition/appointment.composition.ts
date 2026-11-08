import type { Router } from 'express';
import type { EnvironmentConfig } from '../../config/environment.config.js';
import { PrismaAppointmentRepository } from '../repositories/appointment/prismaAppointment.repository.js';
import { EmailService } from '../services/email/email.service.js';
import { CreateAppointmentUseCase } from '../../application/use-cases/appointment/createAppointment.useCase.js';
import { AppointmentController } from '../../presentation/controllers/appointment/appointment.controller.js';
import { buildAppointmentRoutes } from '../../presentation/routes/appointment/appointment.routes.js';

export interface AppointmentComposition {
  repository: PrismaAppointmentRepository;
  controller: AppointmentController;
  router: Router;
}

export function buildAppointmentComposition(config?: EnvironmentConfig): AppointmentComposition {
  const repository = new PrismaAppointmentRepository();
  const emailService = new EmailService(config);
  const createAppointmentUseCase = new CreateAppointmentUseCase(
    repository,
    emailService,
    config?.appointmentNotificationEmail
  );

  const controller = new AppointmentController(createAppointmentUseCase);
  const router = buildAppointmentRoutes({
    appointmentController: controller,
  });

  return {
    repository,
    controller,
    router,
  };
}
