import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { IStorageService } from '../../../shared/interfaces/services/IStorageService.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import { GalleryMapper } from '../../../infrastructure/mappers/gallery/gallery.mapper.js';
import { INITIAL_GALLERY_ITEMS } from '../../../infrastructure/data/galleryData.js';
import { extractImageKey } from '../../utils/imageUpload.helper.js';

export class ResetGalleryDefaultsUseCase {
  constructor(
    private readonly galleryRepository: IGalleryRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(): Promise<GalleryItemResponseDto[]> {
    const existing = await this.galleryRepository.findAll();
    for (const item of existing) {
      const keyToDelete = extractImageKey(item.imageKey, item.imageUrl);
      if (keyToDelete) {
        await this.storageService.deleteFile(keyToDelete);
      }
    }

    const defaultEntities = INITIAL_GALLERY_ITEMS.map((item) =>
      GalleryMapper.toDomain(item)
    );

    const resetRecords = await this.galleryRepository.resetDefaults(defaultEntities);
    return resetRecords.map((item) => GalleryMapper.toDto(item));
  }
}
