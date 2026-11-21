import type { GalleryItem as PrismaGalleryItem } from '@prisma/client';
import { GalleryItem } from '../../../domain/entities/gallery/galleryItem.entity.js';
import type { CreateGalleryItemRequestDto } from '../../../application/dtos/request/gallery/createGalleryItem.dto.js';
import type { GalleryItemResponseDto } from '../../../application/dtos/response/gallery/galleryItem.dto.js';
import crypto from 'crypto';

interface SeedGalleryItemInput {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  author: string;
  aspectRatio: string;
  createdAt: string;
}

export class GalleryMapper {
  static toDomain(record: PrismaGalleryItem): GalleryItem;
  static toDomain(dto: CreateGalleryItemRequestDto, imageUrl: string, imageKey?: string | null): GalleryItem;
  static toDomain(item: SeedGalleryItemInput): GalleryItem;
  static toDomain(
    source: PrismaGalleryItem | CreateGalleryItemRequestDto | SeedGalleryItemInput,
    imageUrl?: string,
    imageKey: string | null = null
  ): GalleryItem {
    if ('updatedAt' in source) {
      return new GalleryItem(
        source.id,
        source.title,
        source.category,
        source.imageUrl,
        source.imageKey,
        source.description,
        source.author,
        source.aspectRatio,
        source.createdAt,
        source.updatedAt
      );
    }

    if (imageUrl !== undefined) {
      const dto = source as CreateGalleryItemRequestDto;
      return new GalleryItem(
        crypto.randomUUID(),
        dto.title.trim(),
        (dto.category || 'yoga').toLowerCase(),
        imageUrl,
        imageKey,
        dto.description ? dto.description.trim() : null,
        dto.author ? dto.author.trim() : 'Doctor / Wellness Admin',
        dto.aspectRatio || 'landscape',
        new Date(),
        new Date()
      );
    }

    const seed = source as SeedGalleryItemInput;
    return new GalleryItem(
      seed.id,
      seed.title,
      seed.category,
      seed.imageUrl,
      null,
      seed.description,
      seed.author,
      seed.aspectRatio,
      new Date(seed.createdAt),
      new Date(seed.createdAt)
    );
  }

  static toDto(item: GalleryItem): GalleryItemResponseDto {
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
  }

  static toPersistence(item: GalleryItem): PrismaGalleryItem {
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      imageKey: item.imageKey,
      description: item.description,
      author: item.author || 'Doctor / Wellness Admin',
      aspectRatio: item.aspectRatio || 'landscape',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
