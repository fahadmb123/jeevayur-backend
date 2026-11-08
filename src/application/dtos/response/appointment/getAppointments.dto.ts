import type { AppointmentResponseDto } from './createAppointment.dto.js';

export interface GetAppointmentsResponseDto {
  appointments: AppointmentResponseDto[];
  total: number;
}

