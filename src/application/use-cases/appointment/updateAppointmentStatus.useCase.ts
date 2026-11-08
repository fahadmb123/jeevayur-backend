import type { IAppointmentRepository } from '../../../domain/repositories/appointment/appointment.repository.js';
import type { UpdateAppointmentStatusResponseDto } from '../../dtos/response/appointment/updateAppointmentStatus.dto.js';
import { AppointmentMapper } from '../../../infrastructure/mappers/appointment/appointment.mapper.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';

export class UpdateAppointmentStatusUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(id: string, rawStatus: string): Promise<UpdateAppointmentStatusResponseDto> {
    const existing = await this.appointmentRepository.findById(id);
    if (!existing) {
      throw new ApplicationError('NOT_FOUND', 'Appointment not found', 'NOT_FOUND');
    }

    const upper = rawStatus.toUpperCase();
    const status = upper === 'ACCEPTED' ? 'CONFIRMED' : upper === 'REJECTED' ? 'CANCELLED' : upper;

    const updated = await this.appointmentRepository.updateStatus(id, status);
    return AppointmentMapper.toDto(updated);
  }
}
