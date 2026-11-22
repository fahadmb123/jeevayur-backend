import type { IYogaRepository } from '../../../domain/repositories/yoga/yoga.repository.js';
import type { YogaSession } from '../../../domain/entities/yoga/yogaSession.entity.js';

export class GetYogaSessionsUseCase {
  constructor(private readonly yogaRepository: IYogaRepository) {}

  public async execute(format?: string, search?: string): Promise<YogaSession[]> {
    return this.yogaRepository.findAll(format, search);
  }
}
