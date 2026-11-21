import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { B2StorageService } from '../../../infrastructure/services/storage/b2Storage.service.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import { INITIAL_GALLERY_ITEMS } from '../../../presentation/controllers/gallery/gallery.constants.js';

export class ResetGalleryDefaultsUseCase {
  constructor(
    private readonly galleryRepository: IGalleryRepository,
    private readonly b2Storage: B2StorageService
  ) {}

  async execute(): Promise<GalleryItemResponseDto[]> {
    const existing = await this.galleryRepository.findAll();
    for (const item of existing) {
      if (item.imageKey) {
        await this.b2Storage.deleteFile(item.imageKey);
      }
    }

    const resetRecords = await this.galleryRepository.resetDefaults(INITIAL_GALLERY_ITEMS);

    return resetRecords.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      imageKey: item.imageKey,
      description: item.description,
      author: item.author || 'Doctor / Wellness Admin',
      aspectRatio: item.aspectRatio || 'landscape',
      createdAt: item.createdAt.toISOString().split('T')[0],
    }));
  }
}
