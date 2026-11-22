import type { IGalleryRepository, GalleryCounts } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import { GalleryMapper } from '../../../infrastructure/mappers/gallery/gallery.mapper.js';

export interface GetGalleryItemsResult {
  items: GalleryItemResponseDto[];
  counts: GalleryCounts;
}

export class GetGalleryItemsUseCase {
  constructor(private readonly galleryRepository: IGalleryRepository) {}

  async execute(category?: string, search?: string): Promise<GetGalleryItemsResult> {
    const [records, counts] = await Promise.all([
      this.galleryRepository.findAll(category, search),
      this.galleryRepository.getCounts(),
    ]);

    return {
      items: records.map((item) => GalleryMapper.toDto(item)),
      counts,
    };
  }
}
