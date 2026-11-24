export interface DoctorDashboardStats {
  activePatients: number;
  totalPatients?: number;
  todayConsultations: number;
  completedTherapies: number;
  pendingReviews: number;
  inboundRequests?: number;
}

export class DoctorDashboard {
  constructor(
    public readonly stats: DoctorDashboardStats,
    public readonly retrievedAt: Date = new Date()
  ) {}
}
