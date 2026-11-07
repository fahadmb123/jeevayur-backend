import type { DoctorDashboardStats } from '../../../../domain/entities/doctor/doctorDashboard.entity.js';

export interface DoctorDashboardResponseDto {
  stats: DoctorDashboardStats;
}

