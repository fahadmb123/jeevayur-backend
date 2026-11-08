export interface UpdateAppointmentStatusRequestDto {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  reason?: string;
}
