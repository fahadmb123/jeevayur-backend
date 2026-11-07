import type { IUseCase } from '../../../../shared/interfaces/use-cases/IUseCase.js';
import type { DoctorDashboardResponseDto } from '../../../dtos/doctor/response/doctorDashboard.dto.js';
import { DoctorDashboard } from '../../../../domain/entities/doctor/doctorDashboard.entity.js';

export class GetDoctorDashboardUseCase implements IUseCase<void, DoctorDashboardResponseDto> {
  async execute(): Promise<DoctorDashboardResponseDto> {
    const dashboard = new DoctorDashboard({
      activePatients: 24,
      todayConsultations: 6,
      completedTherapies: 142,
      pendingReviews: 3,
    });

    return {
      stats: dashboard.stats,
    };
  }
}
