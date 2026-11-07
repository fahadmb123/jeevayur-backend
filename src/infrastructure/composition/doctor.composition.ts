import type { Router, RequestHandler } from 'express';
import { GetDoctorDashboardUseCase } from '../../application/use-cases/doctor/dashboard/getDoctorDashboard.useCase.js';
import { DoctorController } from '../../presentation/controllers/doctor/doctor.controller.js';
import { buildDoctorRoutes } from '../../presentation/routes/doctor/doctor.routes.js';

export interface DoctorComposition {
  getDashboardUseCase: GetDoctorDashboardUseCase;
  doctorController: DoctorController;
  router: Router;
}

export function buildDoctorComposition(authMiddleware?: RequestHandler): DoctorComposition {
  const getDashboardUseCase = new GetDoctorDashboardUseCase();
  const doctorController = new DoctorController(getDashboardUseCase);
  const router = buildDoctorRoutes({
    doctorController,
    authMiddleware,
  });

  return {
    getDashboardUseCase,
    doctorController,
    router,
  };
}
