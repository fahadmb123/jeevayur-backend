import type {
  IPatientRepository,
  CreatePatientData,
} from '../../../domain/repositories/patient/patient.repository.js';
import type { Patient } from '../../../domain/entities/patient/patient.entity.js';
import { PatientMapper } from '../../mappers/patient/patient.mapper.js';
import { db } from '../../../shared/database/client.js';

export class PrismaPatientRepository implements IPatientRepository {
  async findById(id: string): Promise<Patient | null> {
    const record = await db.patient.findUnique({
      where: { id },
    });
    if (!record) return null;
    return PatientMapper.toDomain(record);
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
}

