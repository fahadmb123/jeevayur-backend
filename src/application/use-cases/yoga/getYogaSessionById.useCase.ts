import type { IYogaRepository } from '../../../domain/repositories/yoga/yoga.repository.js';
import type { YogaSession } from '../../../domain/entities/yoga/yogaSession.entity.js';

export class GetYogaSessionByIdUseCase {
  constructor(private readonly yogaRepository: IYogaRepository) {}

  public async execute(id: string): Promise<YogaSession | null> {
    return this.yogaRepository.findById(id);
  }
}
