export interface DoctorDashboardStats {
  activePatients: number;
  todayConsultations: number;
  completedTherapies: number;
  pendingReviews: number;
}

export class DoctorDashboard {
  constructor(
    public readonly stats: DoctorDashboardStats,
    public readonly retrievedAt: Date = new Date()
  ) {}
}

