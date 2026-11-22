import type {
  IAppointmentRepository,
  AppointmentFilterCriteria,
} from '../../../domain/repositories/appointment/appointment.repository.js';
import type { GetAppointmentsResponseDto } from '../../dtos/response/appointment/getAppointments.dto.js';
import { AppointmentMapper } from '../../../infrastructure/mappers/appointment/appointment.mapper.js';

export class GetAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(criteria?: AppointmentFilterCriteria): Promise<GetAppointmentsResponseDto> {
    const [appointments, counts] = await Promise.all([
      this.appointmentRepository.findFiltered(criteria),
      this.appointmentRepository.getCounts(),
    ]);

    return {
      appointments: appointments.map((appointment) => AppointmentMapper.toDto(appointment)),
      total: appointments.length,
      counts,
    };
  }
}
