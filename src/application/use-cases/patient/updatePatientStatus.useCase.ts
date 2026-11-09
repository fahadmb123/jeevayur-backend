import { injectable, inject } from 'tsyringe';
import type { IPatientRepository } from '../../../domain/repositories/patient/patient.repository.js';
import type { Patient } from '../../../domain/entities/patient/patient.entity.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import { TOKENS } from '../../../infrastructure/di/tokens.js';

@injectable()
export class UpdatePatientStatusUseCase {
  constructor(
    @inject(TOKENS.PatientRepository) private readonly patientRepository: IPatientRepository
  ) {}

  async execute(id: string, rawStatus: string): Promise<Patient> {
    const existing = await this.patientRepository.findById(id);
    if (!existing) {
      throw new ApplicationError('NOT_FOUND', 'Patient not found', 'NOT_FOUND');
    }

    const normalized =
      rawStatus?.trim().toLowerCase() === 'completed' ? 'Completed' : 'Uncompleted';

    return this.patientRepository.updateStatus(id, normalized);
  }
}
