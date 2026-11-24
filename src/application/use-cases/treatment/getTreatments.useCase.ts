import type { IUseCase } from '../../../shared/interfaces/use-cases/IUseCase.js';
import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { TreatmentsResponseDto, TreatmentItemDto } from '../../dtos/treatment/treatment.dto.js';
import { FAQS_DATA } from '../../../infrastructure/data/treatmentData.js';

export interface GetTreatmentsInput {
  search?: string;
}

export class GetTreatmentsUseCase implements IUseCase<GetTreatmentsInput, TreatmentsResponseDto> {
  constructor(private readonly galleryRepository: IGalleryRepository) {}

  async execute(input: GetTreatmentsInput = {}): Promise<TreatmentsResponseDto> {
    const search = (input.search || '').trim().toLowerCase();
    const galleryItems = await this.galleryRepository.findAll('treatment');

    let results: TreatmentItemDto[] = galleryItems.map((item) => ({
      id: item.id,
      title: item.title,
      categoryTag: 'Clinical Treatment',
      description: item.description || 'Authentic clinical Ayurvedic formulation and therapy guided by Dr. Ahalya T.S.',
      icon: '🌿',
      image: item.imageUrl,
      benefits: [
        'Classical herbal and clinical formulation',
        'Personalized treatment methodology',
        'Root-cause holistic healing',
      ],
      duration: 'Personalized Care',
      category: 'all',
    }));

    if (search) {
      results = results.filter((item) => {
        const inTitle = item.title.toLowerCase().includes(search);
        const inDesc = item.description.toLowerCase().includes(search);
        const inTag = (item.categoryTag || '').toLowerCase().includes(search);
        const inBenefits = (item.benefits || []).some((b: string) => b.toLowerCase().includes(search));
        return inTitle || inDesc || inTag || inBenefits;
      });
    }

    return {
      treatments: results,
      total: results.length,
      faqs: FAQS_DATA,
    };
  }
}
