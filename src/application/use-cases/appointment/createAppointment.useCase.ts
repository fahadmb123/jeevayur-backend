import type { IAppointmentRepository } from '../../../domain/repositories/appointment/appointment.repository.js';
import type { IEmailService } from '../../../shared/interfaces/services/IEmailService.js';
import type { CreateAppointmentRequestDto } from '../../dtos/request/appointment/createAppointment.dto.js';
import type { CreateAppointmentResponseDto } from '../../dtos/response/appointment/createAppointment.dto.js';
import { AppointmentMapper } from '../../../infrastructure/mappers/appointment/appointment.mapper.js';
import { Logger } from '../../../shared/logging/Logger.js';

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly emailService: IEmailService,
    private readonly notificationEmail?: string
  ) {}

  async execute(dto: CreateAppointmentRequestDto): Promise<CreateAppointmentResponseDto> {
    const savedAppointment = await this.appointmentRepository.create({
      type: dto.type,
      name: dto.name,
      email: dto.email,
      reason: dto.reason,
      format: dto.format,
      language: dto.language,
    });

    const destinationEmail =
      this.notificationEmail ||
      process.env.APPOINTMENT_NOTIFICATION_EMAIL ||
      process.env.CLINIC_NOTIFICATION_EMAIL ||
      process.env.BREVO_SENDER_EMAIL ||
      'fahadmbasheer@gmail.com';

    try {
      await this.emailService.sendAppointmentNotificationEmail({
        toEmail: destinationEmail,
        type: savedAppointment.type,
        name: savedAppointment.name,
        email: savedAppointment.email,
        reason: savedAppointment.reason,
        format: savedAppointment.format,
        language: savedAppointment.language,
        createdAt: savedAppointment.createdAt,
      });
      Logger.info(
        `[CreateAppointmentUseCase] Appointment notification successfully dispatched to: ${destinationEmail}`
      );
    } catch (emailErr) {
      Logger.error(
        `[CreateAppointmentUseCase] Failed to send appointment email notification to ${destinationEmail}:`,
        emailErr
      );
    }

    return AppointmentMapper.toDto(savedAppointment);
  }
}
