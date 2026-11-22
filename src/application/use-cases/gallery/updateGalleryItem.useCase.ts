import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { B2StorageService } from '../../../infrastructure/services/storage/b2Storage.service.js';
import type { UpdateGalleryItemRequestDto } from '../../dtos/request/gallery/updateGalleryItem.dto.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import type { UploadFilePayload } from './createGalleryItem.useCase.js';
import { GalleryMapper } from '../../../infrastructure/mappers/gallery/gallery.mapper.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import crypto from 'crypto';

export class UpdateGalleryItemUseCase {
  private readonly maxFileSizeBytes = 2 * 1024 * 1024;

  constructor(
    private readonly galleryRepository: IGalleryRepository,
    private readonly b2Storage: B2StorageService
  ) {}

  async execute(
    id: string,
    dto: UpdateGalleryItemRequestDto,
    file?: UploadFilePayload
  ): Promise<GalleryItemResponseDto> {
    const existing = await this.galleryRepository.findById(id);
    if (!existing) {
      throw new ApplicationError('NOT_FOUND', 'Gallery item not found', 'NOT_FOUND');
    }

    let finalImageUrl = existing.imageUrl;
    let finalImageKey = existing.imageKey;
    const category = (dto.category || existing.category).toLowerCase();

    if (file) {
      if (file.size > this.maxFileSizeBytes || file.buffer.length > this.maxFileSizeBytes) {
        throw new ApplicationError(
          'FILE_TOO_LARGE',
          'Image file must be less than 2MB',
          'VALIDATION'
        );
      }

      if (existing.imageKey) {
        await this.b2Storage.deleteFile(existing.imageKey);
      }

      const fileExt = file.originalname.split('.').pop() || 'jpg';
      const randomStr = crypto.randomBytes(4).toString('hex');
      finalImageKey = `gallery/${category}-${Date.now()}-${randomStr}.${fileExt}`;
      await this.b2Storage.uploadFile(file.buffer, finalImageKey, file.mimetype || 'image/jpeg');
      finalImageUrl = `/api/gallery/images/${encodeURIComponent(finalImageKey)}`;
    } else if (dto.imageUrl && dto.imageUrl.startsWith('data:image/')) {
      const matches = dto.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        if (buffer.length > this.maxFileSizeBytes) {
          throw new ApplicationError(
            'FILE_TOO_LARGE',
            'Image file must be less than 2MB',
            'VALIDATION'
          );
        }

        if (existing.imageKey) {
          await this.b2Storage.deleteFile(existing.imageKey);
        }

        const ext = mimeType.split('/')[1] || 'jpg';
        const randomStr = crypto.randomBytes(4).toString('hex');
        finalImageKey = `gallery/${category}-${Date.now()}-${randomStr}.${ext}`;
        await this.b2Storage.uploadFile(buffer, finalImageKey, mimeType);
        finalImageUrl = `/api/gallery/images/${encodeURIComponent(finalImageKey)}`;
      }
    } else if (dto.imageUrl && dto.imageUrl.trim() !== '') {
      const newUrl = dto.imageUrl.trim();
      if (newUrl !== existing.imageUrl) {
        if (existing.imageKey && !newUrl.includes(existing.imageKey)) {
          await this.b2Storage.deleteFile(existing.imageKey);
          finalImageKey = null;
        }
        finalImageUrl = newUrl;
      }
    }

    const updatedEntity = GalleryMapper.toDomain(existing, {
      title: dto.title,
      category: dto.category,
      imageUrl: finalImageUrl,
      imageKey: finalImageKey,
      description: dto.description,
      author: dto.author,
      aspectRatio: dto.aspectRatio,
    });

    const saved = await this.galleryRepository.update(updatedEntity);
    return GalleryMapper.toDto(saved);
  }
}
