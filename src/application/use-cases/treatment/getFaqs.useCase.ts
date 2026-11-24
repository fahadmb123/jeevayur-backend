import type { IUseCase } from '../../../shared/interfaces/use-cases/IUseCase.js';
import type { FaqDto } from '../../dtos/treatment/treatment.dto.js';
import { FAQS_DATA } from '../../../infrastructure/data/treatmentData.js';

export class GetFaqsUseCase implements IUseCase<void, { faqs: FaqDto[] }> {
  async execute(): Promise<{ faqs: FaqDto[] }> {
    return {
      faqs: FAQS_DATA,
    };
  }
}
