import type { DoctorDashboardStats } from '../../../domain/entities/doctorDashboard.entity.js';

export interface DoctorDashboardResponseDto {
  stats: DoctorDashboardStats;
}
