import { Router, type RequestHandler } from 'express';
import { PatientController } from '../../controllers/patient/patient.controller.js';

export interface PatientRouteDependencies {
  patientController: PatientController;
  authMiddleware?: RequestHandler;
}

export function buildPatientRoutes(deps: PatientRouteDependencies): Router {
  const router = Router();
  const { patientController, authMiddleware } = deps;

  const optionalAuth: RequestHandler = (req, res, next) => {
    if (authMiddleware) {
      authMiddleware(req, res, () => {
        next();
      });
    } else {
      next();
    }
  };

  router.get('/', optionalAuth, patientController.getPatients);
  router.post('/', optionalAuth, patientController.createPatient);
  router.patch('/:id/status', optionalAuth, patientController.updatePatientStatus);
  router.put('/:id/status', optionalAuth, patientController.updatePatientStatus);

  return router;
}
