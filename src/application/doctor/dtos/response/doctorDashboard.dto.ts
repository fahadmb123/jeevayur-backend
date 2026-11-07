import type { DoctorDashboardStats } from '../../../../domain/doctor/entities/doctorDashboard.entity.js';

export interface DoctorDashboardResponseDto {
  stats: DoctorDashboardStats;
}
