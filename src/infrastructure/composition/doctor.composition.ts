import type { Router, RequestHandler } from 'express';
import { GetDoctorDashboardUseCase } from '../../application/doctor/use-cases/dashboard/getDoctorDashboard.useCase.js';
import { DoctorController } from '../../presentation/doctor/controllers/doctor.controller.js';
import { buildDoctorRoutes } from '../../presentation/doctor/routes/doctor.routes.js';

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
