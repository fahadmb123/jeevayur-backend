import type { IAppointmentRepository } from '../../../domain/repositories/appointment/appointment.repository.js';
import type { GetAppointmentsResponseDto } from '../../dtos/response/appointment/getAppointments.dto.js';
import { AppointmentMapper } from '../../../infrastructure/mappers/appointment/appointment.mapper.js';

export class GetAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(): Promise<GetAppointmentsResponseDto> {
    const appointments = await this.appointmentRepository.findAll();
    return {
      appointments: appointments.map((appointment) => AppointmentMapper.toDto(appointment)),
      total: appointments.length,
    };
  }
}

