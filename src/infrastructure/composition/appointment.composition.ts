import type { Router, RequestHandler } from 'express';
import type { EnvironmentConfig } from '../../config/environment.config.js';
import { PrismaAppointmentRepository } from '../repositories/appointment/prismaAppointment.repository.js';
import { PrismaPatientRepository } from '../repositories/patient/prismaPatient.repository.js';
import { EmailService } from '../services/email/email.service.js';
import { CreateAppointmentUseCase } from '../../application/use-cases/appointment/createAppointment.useCase.js';
import { GetAppointmentsUseCase } from '../../application/use-cases/appointment/getAppointments.useCase.js';
import { UpdateAppointmentStatusUseCase } from '../../application/use-cases/appointment/updateAppointmentStatus.useCase.js';
import { AppointmentController } from '../../presentation/controllers/appointment/appointment.controller.js';
import { buildAppointmentRoutes } from '../../presentation/routes/appointment/appointment.routes.js';

export interface AppointmentComposition {
  repository: PrismaAppointmentRepository;
  patientRepository: PrismaPatientRepository;
  controller: AppointmentController;
  router: Router;
}

export function buildAppointmentComposition(
  config?: EnvironmentConfig,
  authMiddleware?: RequestHandler
): AppointmentComposition {
  const repository = new PrismaAppointmentRepository();
  const patientRepository = new PrismaPatientRepository();
  const emailService = new EmailService(config);

  const createAppointmentUseCase = new CreateAppointmentUseCase(
    repository,
    emailService,
    config?.clinicEmail
  );
  const getAppointmentsUseCase = new GetAppointmentsUseCase(repository);
  const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(
    repository,
    patientRepository,
    emailService
  );

  const controller = new AppointmentController(
    createAppointmentUseCase,
    getAppointmentsUseCase,
    updateAppointmentStatusUseCase
  );
  const router = buildAppointmentRoutes({
    appointmentController: controller,
    authMiddleware,
  });

  return {
    repository,
    patientRepository,
    controller,
    router,
  };
}
