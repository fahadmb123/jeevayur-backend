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
    router.post('/', authMiddleware, patientController.createPatient);
    router.patch('/:id/status', authMiddleware, patientController.updatePatientStatus);
    router.put('/:id/status', authMiddleware, patientController.updatePatientStatus);
  } else {
    router.get('/', patientController.getPatients);
    router.post('/', patientController.createPatient);
    router.patch('/:id/status', patientController.updatePatientStatus);
    router.put('/:id/status', patientController.updatePatientStatus);
  }

  return router;
}
