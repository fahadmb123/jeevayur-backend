import { injectable, inject } from 'tsyringe';
import type {
  IPatientRepository,
  PatientFilterCriteria,
} from '../../../domain/repositories/patient/patient.repository.js';
import type { GetPatientsResponseDto } from '../../dtos/response/patient/patient.dto.js';
import { PatientMapper } from '../../../infrastructure/mappers/patient/patient.mapper.js';
import { TOKENS } from '../../../infrastructure/di/tokens.js';

export interface GetPatientsQueryDto {
  search?: string;
  status?: string;
  gender?: string;
  source?: string;
  limit?: number;
  page?: number;
  offset?: number;
}

@injectable()
export class GetPatientsUseCase {
  constructor(
    @inject(TOKENS.PatientRepository) private readonly patientRepository: IPatientRepository
  ) {}

  async execute(query?: GetPatientsQueryDto): Promise<GetPatientsResponseDto> {
    const criteria: PatientFilterCriteria = {
      search: query?.search,
      status: query?.status,
      gender: query?.gender,
      source: query?.source,
      limit: query?.limit,
      offset: query?.offset,
    };

    const result = await this.patientRepository.findFiltered(criteria);
    return {
      patients: result.patients.map((p) => PatientMapper.toDto(p)),
      total: result.total,
      counts: result.counts,
      page: query?.page || 1,
      limit: criteria.limit || 50,
    };
  }
}
