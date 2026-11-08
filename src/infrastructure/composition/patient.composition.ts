import type { Router, RequestHandler } from 'express';
import { PrismaPatientRepository } from '../repositories/patient/prismaPatient.repository.js';
import { GetPatientsUseCase } from '../../application/use-cases/patient/getPatients.useCase.js';
import { CreatePatientUseCase } from '../../application/use-cases/patient/createPatient.useCase.js';
import { PatientController } from '../../presentation/controllers/patient/patient.controller.js';
import { buildPatientRoutes } from '../../presentation/routes/patient/patient.routes.js';

export interface PatientComposition {
  repository: PrismaPatientRepository;
  controller: PatientController;
  router: Router;
}

export function buildPatientComposition(
  authMiddleware?: RequestHandler,
  existingRepository?: PrismaPatientRepository
): PatientComposition {
  const repository = existingRepository ?? new PrismaPatientRepository();
  const getPatientsUseCase = new GetPatientsUseCase(repository);
  const createPatientUseCase = new CreatePatientUseCase(repository);
  const controller = new PatientController(getPatientsUseCase, createPatientUseCase);
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
