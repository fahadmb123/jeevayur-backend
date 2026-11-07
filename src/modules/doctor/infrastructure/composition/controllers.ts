import { DoctorController } from '../../presentation/controllers/doctor.controller.js';
import type { DoctorUseCasesComposition } from './useCases.js';

export interface DoctorControllersComposition {
  doctorController: DoctorController;
}

export function buildDoctorControllers(useCases: DoctorUseCasesComposition): DoctorControllersComposition {
  return {
    doctorController: new DoctorController(useCases.getDashboardUseCase),
  };
}
