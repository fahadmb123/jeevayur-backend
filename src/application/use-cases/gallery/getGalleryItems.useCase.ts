import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import { GalleryMapper } from '../../../infrastructure/mappers/gallery/gallery.mapper.js';

export class GetGalleryItemsUseCase {
  constructor(private readonly galleryRepository: IGalleryRepository) {}

  async execute(category?: string, search?: string): Promise<GalleryItemResponseDto[]> {
    const records = await this.galleryRepository.findAll(category, search);
    return records.map((item) => GalleryMapper.toDto(item));
  }
}
