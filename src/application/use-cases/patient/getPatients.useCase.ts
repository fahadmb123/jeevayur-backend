import type { IPatientRepository } from '../../../domain/repositories/patient/patient.repository.js';
import type { GetPatientsResponseDto } from '../../dtos/response/patient/patient.dto.js';
import { PatientMapper } from '../../../infrastructure/mappers/patient/patient.mapper.js';

export class GetPatientsUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(): Promise<GetPatientsResponseDto> {
    const records = await this.patientRepository.findAll();
    return {
      patients: records.map((p) => PatientMapper.toDto(p)),
      total: records.length,
    };
  }
}

