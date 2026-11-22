import type {
  IAppointmentRepository,
  CreateAppointmentData,
  AppointmentFilterCriteria,
  AppointmentCounts,
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

  async findFiltered(criteria?: AppointmentFilterCriteria): Promise<Appointment[]> {
    const andClauses: any[] = [];

    if (criteria?.status && criteria.status !== 'all' && criteria.status !== 'All') {
      const s = criteria.status.toLowerCase();
      if (s === 'pending') {
        andClauses.push({
          status: { in: ['PENDING', 'pending'] },
        });
      } else if (s === 'accepted' || s === 'confirmed') {
        andClauses.push({
          status: { in: ['CONFIRMED', 'confirmed', 'ACCEPTED', 'accepted'] },
        });
      } else if (s === 'rejected' || s === 'cancelled') {
        andClauses.push({
          status: { in: ['CANCELLED', 'cancelled', 'REJECTED', 'rejected'] },
        });
      }
    }

    if (criteria?.type && criteria.type !== 'all' && criteria.type !== 'All') {
      const t = criteria.type.toLowerCase();
      if (t.includes('yoga')) {
        andClauses.push({
          type: { contains: 'yoga' },
        });
      } else if (t.includes('ayurveda') || t.includes('treatment')) {
        andClauses.push({
          type: { contains: 'ayurveda' },
        });
      }
    }

    if (criteria?.format && criteria.format !== 'all' && criteria.format !== 'All') {
      const f = criteria.format.toLowerCase();
      if (f.includes('online') || f.includes('video')) {
        andClauses.push({
          format: { contains: 'online' },
        });
      } else if (f.includes('offline') || f.includes('person')) {
        andClauses.push({
          format: { contains: 'offline' },
        });
      }
    }

    if (criteria?.search && criteria.search.trim()) {
      const q = criteria.search.trim();
      andClauses.push({
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { phone: { contains: q } },
          { reason: { contains: q } },
          { language: { contains: q } },
        ],
      });
    }

    const where = andClauses.length > 0 ? { AND: andClauses } : {};
    const records = await db.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r) => AppointmentMapper.toDomain(r));
  }

  async getCounts(): Promise<AppointmentCounts> {
    const [all, pending, accepted, rejected] = await Promise.all([
      db.appointment.count(),
      db.appointment.count({
        where: { status: { in: ['PENDING', 'pending'] } },
      }),
      db.appointment.count({
        where: { status: { in: ['CONFIRMED', 'confirmed', 'ACCEPTED', 'accepted'] } },
      }),
      db.appointment.count({
        where: { status: { in: ['CANCELLED', 'cancelled', 'REJECTED', 'rejected'] } },
      }),
    ]);

    return { all, pending, accepted, rejected };
  }

  async updateStatus(id: string, status: string): Promise<Appointment> {
    const record = await db.appointment.update({
      where: { id },
      data: { status },
    });
    return AppointmentMapper.toDomain(record);
  }
}
