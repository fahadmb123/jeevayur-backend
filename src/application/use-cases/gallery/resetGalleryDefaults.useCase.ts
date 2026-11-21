import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { B2StorageService } from '../../../infrastructure/services/storage/b2Storage.service.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import { GalleryItem } from '../../../domain/entities/gallery/galleryItem.entity.js';
import { GalleryMapper } from '../../../infrastructure/mappers/gallery/gallery.mapper.js';
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

    const defaultEntities = INITIAL_GALLERY_ITEMS.map(
      (item) =>
        new GalleryItem(
          item.id,
          item.title,
          item.category,
          item.imageUrl,
          null,
          item.description,
          item.author,
          item.aspectRatio,
          new Date(item.createdAt),
          new Date(item.createdAt)
        )
    );

    const resetRecords = await this.galleryRepository.resetDefaults(defaultEntities);
    return resetRecords.map((item) => GalleryMapper.toDto(item));
  }
}
