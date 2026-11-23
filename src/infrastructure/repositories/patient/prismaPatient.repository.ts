import type {
  IPatientRepository,
  CreatePatientData,
  PatientFilterCriteria,
  PatientQueryResult,
} from '../../../domain/repositories/patient/patient.repository.js';
import type { Patient } from '../../../domain/entities/patient/patient.entity.js';
import { PatientMapper } from '../../mappers/patient/patient.mapper.js';
import { db } from '../../../shared/database/client.js';

export class PrismaPatientRepository implements IPatientRepository {
  async findById(id: string): Promise<Patient | null> {
    const record = await db.patient.findUnique({
      where: { id },
    });
    if (record) return PatientMapper.toDomain(record);

    const apt = await db.appointment.findUnique({
      where: { id },
    });
    if (apt) {
      const existingPatient = apt.email
        ? await db.patient.findFirst({ where: { email: apt.email } })
        : await db.patient.findFirst({ where: { name: apt.name } });
      if (existingPatient) {
        return PatientMapper.toDomain(existingPatient);
      }
      const created = await db.patient.create({
        data: {
          name: apt.name,
          email: apt.email,
          phone: apt.phone,
          condition: `${apt.type} (${apt.format}): ${apt.reason}`,
          status: apt.status === 'COMPLETED' ? 'Completed' : 'Uncompleted',
          lastVisit: 'Website Booking',
        },
      });
      return PatientMapper.toDomain(created);
    }

    return null;
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const record = await db.patient.findFirst({
      where: { email },
    });
    if (!record) return null;
    return PatientMapper.toDomain(record);
  }

  async create(data: CreatePatientData): Promise<Patient> {
    const record = await db.patient.create({
      data: {
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        gender: data.gender ?? null,
        age: data.age ?? null,
        condition: data.condition ?? null,
        status: data.status ?? 'Consultation',
        lastVisit: data.lastVisit ?? 'Today (New Request)',
      },
    });
    return PatientMapper.toDomain(record);
  }

  async findAll(): Promise<Patient[]> {
    const records = await db.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => PatientMapper.toDomain(r));
  }

  async updateStatus(id: string, status: string): Promise<Patient> {
    const normalized = status.trim().toLowerCase() === 'completed' ? 'Completed' : 'Uncompleted';
    const aptStatus = normalized === 'Completed' ? 'COMPLETED' : 'CONFIRMED';

    const existingPatient = await db.patient.findUnique({
      where: { id },
    });

    if (existingPatient) {
      const record = await db.patient.update({
        where: { id },
        data: { status: normalized },
      });

      if (record.email || record.name) {
        try {
          await db.appointment.updateMany({
            where: {
              OR: [
                ...(record.email ? [{ email: record.email }] : []),
                { name: record.name },
              ],
            },
            data: { status: aptStatus },
          });
        } catch {}
      }

      return PatientMapper.toDomain(record);
    }

    const apt = await db.appointment.findUnique({
      where: { id },
    });

    if (apt) {
      await db.appointment.update({
        where: { id },
        data: { status: aptStatus },
      });

      const matchingPatient = apt.email
        ? await db.patient.findFirst({ where: { email: apt.email } })
        : await db.patient.findFirst({ where: { name: apt.name } });

      if (matchingPatient) {
        const updated = await db.patient.update({
          where: { id: matchingPatient.id },
          data: { status: normalized },
        });
        return PatientMapper.toDomain(updated);
      }

      const created = await db.patient.create({
        data: {
          name: apt.name,
          email: apt.email,
          phone: apt.phone,
          condition: `${apt.type} (${apt.format}): ${apt.reason}`,
          status: normalized,
          lastVisit: 'Website Booking',
        },
      });
      return PatientMapper.toDomain(created);
    }

    throw new Error(`Patient record not found for id: ${id}`);
  }

  async findFiltered(criteria: PatientFilterCriteria): Promise<PatientQueryResult> {
    const andClauses: any[] = [];

    if (criteria.search && criteria.search.trim()) {
      const q = criteria.search.trim();
      andClauses.push({
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { phone: { contains: q } },
          { condition: { contains: q } },
        ],
      });
    }

    if (criteria.status && criteria.status !== 'All') {
      const s = criteria.status.toLowerCase();
      if (s === 'completed') {
        andClauses.push({
          status: { in: ['Completed', 'completed', 'Recovered', 'recovered'] },
        });
      } else if (s === 'uncompleted') {
        andClauses.push({
          status: { notIn: ['Completed', 'completed', 'Recovered', 'recovered'] },
        });
      }
    }

    if (criteria.gender && criteria.gender !== 'All') {
      andClauses.push({
        gender: criteria.gender,
      });
    }

    if (criteria.source && criteria.source !== 'All') {
      const src = criteria.source.toLowerCase();
      if (src === 'website') {
        andClauses.push({
          OR: [
            { lastVisit: { contains: 'website' } },
            { lastVisit: { contains: 'request' } },
          ],
        });
      } else if (src === 'doctor') {
        andClauses.push({
          NOT: [
            { lastVisit: { contains: 'website' } },
            { lastVisit: { contains: 'request' } },
          ],
        });
      }
    }

    const where: any = andClauses.length > 0 ? { AND: andClauses } : {};
    const limit = criteria.limit ? Math.min(Math.max(1, Number(criteria.limit)), 200) : 50;
    const offset = criteria.offset ? Math.max(0, Number(criteria.offset)) : 0;

    const [records, total, allCount, completedCount, uncompletedCount] = await Promise.all([
      db.patient.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      db.patient.count({ where }),
      db.patient.count(),
      db.patient.count({
        where: {
          status: { in: ['Completed', 'completed', 'Recovered', 'recovered'] },
        },
      }),
      db.patient.count({
        where: {
          status: { notIn: ['Completed', 'completed', 'Recovered', 'recovered'] },
        },
      }),
    ]);

    return {
      patients: records.map((r) => PatientMapper.toDomain(r)),
      total,
      counts: {
        all: allCount,
        completed: completedCount,
        uncompleted: uncompletedCount,
      },
    };
  }
}

