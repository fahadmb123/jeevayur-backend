import { GetDoctorDashboardUseCase } from '../../application/use-cases/dashboard/getDoctorDashboard.useCase.js';

export interface DoctorUseCasesComposition {
  getDashboardUseCase: GetDoctorDashboardUseCase;
}

export function buildDoctorUseCases(): DoctorUseCasesComposition {
  return {
    getDashboardUseCase: new GetDoctorDashboardUseCase(),
  };
}
