import { injectable, inject } from 'tsyringe';
import type { IPatientRepository } from '../../../domain/repositories/patient/patient.repository.js';
import type { GetPatientsResponseDto } from '../../dtos/response/patient/patient.dto.js';
import { PatientMapper } from '../../../infrastructure/mappers/patient/patient.mapper.js';
import { TOKENS } from '../../../infrastructure/di/tokens.js';

@injectable()
export class GetPatientsUseCase {
  constructor(
    @inject(TOKENS.PatientRepository) private readonly patientRepository: IPatientRepository
  ) {}

  async execute(): Promise<GetPatientsResponseDto> {
    const records = await this.patientRepository.findAll();
    return {
      patients: records.map((p) => PatientMapper.toDto(p)),
      total: records.length,
    };
  }
}
