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

    if (existing.imageKey) {
      await this.b2Storage.deleteFile(existing.imageKey);
    }

    await this.galleryRepository.delete(id);
  }
}
