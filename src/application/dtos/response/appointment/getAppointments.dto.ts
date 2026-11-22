import type { AppointmentResponseDto } from './createAppointment.dto.js';
import type { AppointmentCounts } from '../../../../domain/repositories/appointment/appointment.repository.js';

export interface GetAppointmentsResponseDto {
  appointments: AppointmentResponseDto[];
  total: number;
  counts: AppointmentCounts;
}
