import type { IAppointmentRepository } from '../../../domain/repositories/appointment/appointment.repository.js';
import type { IPatientRepository } from '../../../domain/repositories/patient/patient.repository.js';
import type { IEmailService } from '../../../shared/interfaces/services/IEmailService.js';
import type { UpdateAppointmentStatusResponseDto } from '../../dtos/response/appointment/updateAppointmentStatus.dto.js';
import { AppointmentMapper } from '../../../infrastructure/mappers/appointment/appointment.mapper.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import { Logger } from '../../../shared/logging/Logger.js';

export class UpdateAppointmentStatusUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(
    id: string,
    rawStatus: string,
    reason?: string
  ): Promise<UpdateAppointmentStatusResponseDto> {
    const existing = await this.appointmentRepository.findById(id);
    if (!existing) {
      throw new ApplicationError('NOT_FOUND', 'Appointment not found', 'NOT_FOUND');
    }

    const upper = rawStatus.toUpperCase();
    const status = upper === 'ACCEPTED' ? 'CONFIRMED' : upper === 'REJECTED' ? 'CANCELLED' : upper;

    const updated = await this.appointmentRepository.updateStatus(id, status);

    if (status === 'CONFIRMED') {
      try {
        await this.patientRepository.create({
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          condition: `${updated.type} (${updated.format}): ${updated.reason}`,
          status: 'Consultation',
          lastVisit: 'Today (New Request)',
        });
      } catch (patientError) {
        Logger.error('[UpdateAppointmentStatusUseCase] Failed to save patient record:', patientError);
      }

      try {
        await this.emailService.sendAppointmentAcceptedEmail({
          toEmail: updated.email,
          recipientName: updated.name,
          type: updated.type,
          format: updated.format,
          language: updated.language,
          reason: updated.reason,
        });
      } catch (emailError) {
        Logger.error('[UpdateAppointmentStatusUseCase] Failed to send accepted email:', emailError);
      }
    } else if (status === 'CANCELLED') {
      try {
        await this.emailService.sendAppointmentRejectedEmail({
          toEmail: updated.email,
          recipientName: updated.name,
          type: updated.type,
          reason,
        });
      } catch (emailError) {
        Logger.error('[UpdateAppointmentStatusUseCase] Failed to send rejected email:', emailError);
      }
    }

    return AppointmentMapper.toDto(updated);
  }
}
