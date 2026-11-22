import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { B2StorageService } from '../../../infrastructure/services/storage/b2Storage.service.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';

export class DeleteGalleryItemUseCase {
  constructor(
    private readonly galleryRepository: IGalleryRepository,
    private readonly b2Storage: B2StorageService
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.galleryRepository.findById(id);
    if (!existing) {
      throw new ApplicationError('NOT_FOUND', 'Gallery item not found', 'NOT_FOUND');
    }

    let keyToDelete = existing.imageKey;
    if (!keyToDelete && existing.imageUrl && existing.imageUrl.includes('/api/gallery/images/')) {
      const parts = existing.imageUrl.split('/api/gallery/images/');
      if (parts[1]) {
        keyToDelete = decodeURIComponent(parts[1]);
      }
    }

    if (keyToDelete) {
      await this.b2Storage.deleteFile(keyToDelete);
    }

    await this.galleryRepository.delete(id);
  }
}
