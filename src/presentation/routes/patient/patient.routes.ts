import { Router, type RequestHandler } from 'express';
import { PatientController } from '../../controllers/patient/patient.controller.js';

export interface PatientRouteDependencies {
  patientController: PatientController;
  authMiddleware?: RequestHandler;
}

export function buildPatientRoutes(deps: PatientRouteDependencies): Router {
  const router = Router();
  const { patientController, authMiddleware } = deps;

  if (authMiddleware) {
    router.get('/', authMiddleware, patientController.getPatients);
  } else {
    router.get('/', patientController.getPatients);
  }

  return router;
}

