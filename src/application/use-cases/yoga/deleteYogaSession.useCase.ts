import type { IYogaRepository } from '../../../domain/repositories/yoga/yoga.repository.js';

export class DeleteYogaSessionUseCase {
  constructor(private readonly yogaRepository: IYogaRepository) {}

  public async execute(id: string): Promise<void> {
    const existing = await this.yogaRepository.findById(id);
    if (!existing) {
      throw new Error(`Yoga session with ID ${id} not found.`);
    }
    await this.yogaRepository.delete(id);
  }
}
