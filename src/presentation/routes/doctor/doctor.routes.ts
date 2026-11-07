import { Router } from 'express';
import type { DoctorRouteDependencies } from '../../types/doctor/doctor.types.js';
import { roleMiddleware } from '../../../shared/middlewares/role.middleware.js';

export function buildDoctorRoutes(deps: DoctorRouteDependencies): Router {
  const router = Router();

  if (deps.authMiddleware) {
    router.use(deps.authMiddleware);
    router.use(roleMiddleware('doctor', 'admin'));
  }

  router.get('/dashboard', deps.doctorController.getDashboard);
  return router;
}
