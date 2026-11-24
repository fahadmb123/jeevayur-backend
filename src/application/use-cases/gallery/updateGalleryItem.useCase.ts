import crypto from 'crypto';
import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { IStorageService } from '../../../shared/interfaces/services/IStorageService.js';
import type { UpdateGalleryItemRequestDto } from '../../dtos/request/gallery/updateGalleryItem.dto.js';
import type { GalleryItemResponseDto } from '../../dtos/response/gallery/galleryItem.dto.js';
import type { UploadFilePayload } from './createGalleryItem.useCase.js';
import { GalleryMapper } from '../../../infrastructure/mappers/gallery/gallery.mapper.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import { extractImageKey, parseBase64Image } from '../../utils/imageUpload.helper.js';

export class UpdateGalleryItemUseCase {
  private readonly maxFileSizeBytes = 2 * 1024 * 1024;

  constructor(
    private readonly galleryRepository: IGalleryRepository,
    private readonly storageService: IStorageService
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

    const oldKey = extractImageKey(existing.imageKey, existing.imageUrl);
    let finalImageUrl = existing.imageUrl;
    let finalImageKey = existing.imageKey || oldKey;
    const category = (dto.category || existing.category).toLowerCase();

    if (file) {
      if (file.size > this.maxFileSizeBytes || file.buffer.length > this.maxFileSizeBytes) {
        throw new ApplicationError(
          'FILE_TOO_LARGE',
          'Image file must be less than 2MB',
          'VALIDATION'
        );
      }

      if (oldKey) {
        await this.storageService.deleteFile(oldKey);
      }

      const fileExt = file.originalname.split('.').pop() || 'jpg';
      const randomStr = crypto.randomBytes(4).toString('hex');
      finalImageKey = `gallery/${category}-${Date.now()}-${randomStr}.${fileExt}`;
      await this.storageService.uploadFile(file.buffer, finalImageKey, file.mimetype || 'image/jpeg');
      finalImageUrl = `/api/gallery/images/${encodeURIComponent(finalImageKey)}`;
    } else if (dto.imageUrl && dto.imageUrl.startsWith('data:image/')) {
      const parsed = parseBase64Image(dto.imageUrl);
      if (parsed) {
        if (parsed.buffer.length > this.maxFileSizeBytes) {
          throw new ApplicationError(
            'FILE_TOO_LARGE',
            'Image file must be less than 2MB',
            'VALIDATION'
          );
        }

        if (oldKey) {
          await this.storageService.deleteFile(oldKey);
        }

        const ext = parsed.mimeType.split('/')[1] || 'jpg';
        const randomStr = crypto.randomBytes(4).toString('hex');
        finalImageKey = `gallery/${category}-${Date.now()}-${randomStr}.${ext}`;
        await this.storageService.uploadFile(parsed.buffer, finalImageKey, parsed.mimeType);
        finalImageUrl = `/api/gallery/images/${encodeURIComponent(finalImageKey)}`;
      }
    } else if (dto.imageUrl && dto.imageUrl.trim() !== '') {
      const incomingUrl = dto.imageUrl.trim();
      const decodedIncoming = decodeURIComponent(incomingUrl);
      const isSameAsExisting =
        incomingUrl === existing.imageUrl ||
        (existing.imageUrl && (incomingUrl.endsWith(existing.imageUrl) || existing.imageUrl.endsWith(incomingUrl)));
      const isReferencingOldKey = Boolean(
        oldKey && (decodedIncoming.includes(oldKey) || incomingUrl.includes(oldKey))
      );

      if (isSameAsExisting || isReferencingOldKey) {
        finalImageUrl = existing.imageUrl;
        finalImageKey = existing.imageKey || oldKey;
      } else {
        if (oldKey) {
          await this.storageService.deleteFile(oldKey);
        }
        finalImageKey = null;
        finalImageUrl = incomingUrl;
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
