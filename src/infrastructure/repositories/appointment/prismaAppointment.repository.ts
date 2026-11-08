import type {
  IAppointmentRepository,
  CreateAppointmentData,
} from '../../../domain/repositories/appointment/appointment.repository.js';
import type { Appointment } from '../../../domain/entities/appointment/appointment.entity.js';
import { AppointmentMapper } from '../../mappers/appointment/appointment.mapper.js';
import { db } from '../../../shared/database/client.js';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async findById(id: string): Promise<Appointment | null> {
    const record = await db.appointment.findUnique({
      where: { id },
    });
    if (!record) return null;
    return AppointmentMapper.toDomain(record);
  }

  async create(data: CreateAppointmentData): Promise<Appointment> {
    const record = await db.appointment.create({
      data: {
        type: data.type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        reason: data.reason,
        format: data.format,
        language: data.language,
        status: 'PENDING',
      },
    });
    return AppointmentMapper.toDomain(record);
  }

  async findAll(): Promise<Appointment[]> {
    const records = await db.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => AppointmentMapper.toDomain(r));
  }

  async updateStatus(id: string, status: string): Promise<Appointment> {
    const record = await db.appointment.update({
      where: { id },
      data: { status },
    });
    return AppointmentMapper.toDomain(record);
  }
}
