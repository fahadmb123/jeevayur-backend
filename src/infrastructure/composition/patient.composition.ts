import type { Router, RequestHandler } from 'express';
import { container } from 'tsyringe';
import { PrismaPatientRepository } from '../repositories/patient/prismaPatient.repository.js';
import { PatientController } from '../../presentation/controllers/patient/patient.controller.js';
import { buildPatientRoutes } from '../../presentation/routes/patient/patient.routes.js';
import { TOKENS } from '../di/tokens.js';

export interface PatientComposition {
  repository: PrismaPatientRepository;
  controller: PatientController;
  router: Router;
}

export function buildPatientComposition(
  authMiddleware?: RequestHandler,
  existingRepository?: PrismaPatientRepository
): PatientComposition {
  const repository = existingRepository ?? container.resolve<PrismaPatientRepository>(TOKENS.PatientRepository);
  const controller = container.resolve(PatientController);
  const router = buildPatientRoutes({
    patientController: controller,
    authMiddleware,
  });

  return {
    repository,
    controller,
    router,
  };
}
