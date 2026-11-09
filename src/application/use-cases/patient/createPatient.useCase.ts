import { injectable, inject } from 'tsyringe';
import type { IPatientRepository, CreatePatientData } from '../../../domain/repositories/patient/patient.repository.js';
import type { Patient } from '../../../domain/entities/patient/patient.entity.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import { TOKENS } from '../../../infrastructure/di/tokens.js';

@injectable()
export class CreatePatientUseCase {
  constructor(
    @inject(TOKENS.PatientRepository) private readonly patientRepository: IPatientRepository
  ) {}

  async execute(data: CreatePatientData): Promise<Patient> {
    if (!data.name || !data.name.trim()) {
      throw new ApplicationError('VALIDATION_ERROR', 'Patient name is required', 'VALIDATION');
    }

    return this.patientRepository.create({
      name: data.name.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      gender: data.gender?.trim() || null,
      age: data.age ?? 30,
      condition: data.condition?.trim() || null,
      status: data.status || 'Consultation',
      lastVisit: data.lastVisit || 'Added by Doctor',
    });
  }
}
