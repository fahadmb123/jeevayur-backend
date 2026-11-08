import type { Appointment as PrismaAppointment } from '@prisma/client';
import {
  Appointment,
  type AppointmentType,
  type AppointmentFormat,
  type AppointmentStatus,
} from '../../../domain/entities/appointment/appointment.entity.js';
import type { CreateAppointmentResponseDto } from '../../../application/dtos/response/appointment/createAppointment.dto.js';

export class AppointmentMapper {
  static toDomain(record: PrismaAppointment): Appointment {
    return new Appointment(
      record.id,
      record.type as AppointmentType,
      record.name,
      record.email,
      record.phone,
      record.reason,
      record.format as AppointmentFormat,
      record.language,
      record.status as AppointmentStatus,
      record.createdAt,
      record.updatedAt
    );
  }

  static toDto(appointment: Appointment): CreateAppointmentResponseDto {
    return {
      id: appointment.id,
      type: appointment.type,
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      reason: appointment.reason,
      format: appointment.format,
      language: appointment.language,
      status: appointment.status,
      createdAt: appointment.createdAt.toISOString(),
    };
  }

  static toPersistence(
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
  ): Omit<PrismaAppointment, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      type: appointment.type,
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      reason: appointment.reason,
      format: appointment.format,
      language: appointment.language,
      status: appointment.status,
    };
  }
}
