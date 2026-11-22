import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { B2StorageService } from '../../../infrastructure/services/storage/b2Storage.service.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import { GalleryMapper } from '../../../infrastructure/mappers/gallery/gallery.mapper.js';
import { INITIAL_GALLERY_ITEMS } from '../../../presentation/controllers/gallery/gallery.constants.js';

export class ResetGalleryDefaultsUseCase {
  constructor(
    private readonly galleryRepository: IGalleryRepository,
    private readonly b2Storage: B2StorageService
  ) {}

  private extractImageKey(imageKey?: string | null, imageUrl?: string | null): string | null {
    if (imageKey && imageKey.trim()) {
      return imageKey.trim();
    }
    if (imageUrl && imageUrl.includes('/api/gallery/images/')) {
      const parts = imageUrl.split('/api/gallery/images/');
      if (parts[1]) {
        const raw = parts[1].split('?')[0];
        return decodeURIComponent(raw);
      }
    }
    return null;
  }

  async execute(): Promise<GalleryItemResponseDto[]> {
    const existing = await this.galleryRepository.findAll();
    for (const item of existing) {
      const keyToDelete = this.extractImageKey(item.imageKey, item.imageUrl);
      if (keyToDelete) {
        await this.b2Storage.deleteFile(keyToDelete);
      }
    }

    const defaultEntities = INITIAL_GALLERY_ITEMS.map((item) =>
      GalleryMapper.toDomain(item)
    );

    const resetRecords = await this.galleryRepository.resetDefaults(defaultEntities);
    return resetRecords.map((item) => GalleryMapper.toDto(item));
  }
}
