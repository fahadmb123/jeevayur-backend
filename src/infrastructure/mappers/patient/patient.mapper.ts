import type { Patient as PrismaPatient } from '@prisma/client';
import { Patient } from '../../../domain/entities/patient/patient.entity.js';
import type { PatientResponseDto } from '../../../application/dtos/response/patient/patient.dto.js';

export class PatientMapper {
  static toDomain(record: PrismaPatient): Patient {
    return new Patient(
      record.id,
      record.name,
      record.email,
      record.phone,
      record.gender,
      record.age,
      record.condition,
      record.status,
      record.lastVisit,
      record.createdAt,
      record.updatedAt
    );
  }

  static toDto(patient: Patient): PatientResponseDto {
    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      age: patient.age,
      condition: patient.condition,
      status: patient.status,
      lastVisit: patient.lastVisit,
      createdAt: patient.createdAt.toISOString(),
    };
  }
}

