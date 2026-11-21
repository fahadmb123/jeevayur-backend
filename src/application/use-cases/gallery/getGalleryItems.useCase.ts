import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';

export class GetGalleryItemsUseCase {
  constructor(private readonly galleryRepository: IGalleryRepository) {}

  async execute(category?: string, search?: string): Promise<GalleryItemResponseDto[]> {
    const records = await this.galleryRepository.findAll(category, search);

    return records.map((item) => {
      let displayUrl = item.imageUrl;
      if (item.imageKey && (!displayUrl || displayUrl.startsWith('/api/gallery/images/'))) {
        displayUrl = `/api/gallery/images/${encodeURIComponent(item.imageKey)}`;
      }

      return {
        id: item.id,
        title: item.title,
        category: item.category,
        imageUrl: displayUrl,
        imageKey: item.imageKey,
        description: item.description,
        author: item.author || 'Doctor / Wellness Admin',
        aspectRatio: item.aspectRatio || 'landscape',
        createdAt: item.createdAt.toISOString().split('T')[0],
      };
    });
  }
}
