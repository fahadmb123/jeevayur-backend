import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { IStorageService } from '../../../shared/interfaces/services/IStorageService.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import { extractImageKey } from '../../utils/imageUpload.helper.js';

export class DeleteGalleryItemUseCase {
  constructor(
    private readonly galleryRepository: IGalleryRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.galleryRepository.findById(id);
    if (!existing) {
      throw new ApplicationError('NOT_FOUND', 'Gallery item not found', 'NOT_FOUND');
    }

    const keyToDelete = extractImageKey(existing.imageKey, existing.imageUrl);
    if (keyToDelete) {
      await this.storageService.deleteFile(keyToDelete);
    }

    await this.galleryRepository.delete(id);
  }
}
