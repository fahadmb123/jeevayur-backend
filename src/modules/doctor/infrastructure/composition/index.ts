import type { Router, RequestHandler } from 'express';
import { buildDoctorUseCases, type DoctorUseCasesComposition } from './useCases.js';
import { buildDoctorControllers, type DoctorControllersComposition } from './controllers.js';
import { buildDoctorRoutes } from '../../presentation/routes/doctor.routes.js';

export interface DoctorModuleComposition {
  useCases: DoctorUseCasesComposition;
  controllers: DoctorControllersComposition;
  router: Router;
}

export function buildDoctorModule(authMiddleware?: RequestHandler): DoctorModuleComposition {
  const useCases = buildDoctorUseCases();
  const controllers = buildDoctorControllers(useCases);
  const router = buildDoctorRoutes({
    doctorController: controllers.doctorController,
    authMiddleware,
  });

  return {
    useCases,
    controllers,
    router,
  };
}

export * from './useCases.js';
export * from './controllers.js';
