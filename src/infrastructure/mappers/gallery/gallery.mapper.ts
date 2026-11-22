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

interface UpdateGalleryItemInput {
  title?: string;
  category?: string;
  imageUrl?: string;
  imageKey?: string | null;
  description?: string | null;
  author?: string | null;
  aspectRatio?: string | null;
}

export class GalleryMapper {
  static toDomain(record: PrismaGalleryItem): GalleryItem;
  static toDomain(dto: CreateGalleryItemRequestDto, imageUrl: string, imageKey?: string | null): GalleryItem;
  static toDomain(existing: GalleryItem, updates: UpdateGalleryItemInput): GalleryItem;
  static toDomain(item: SeedGalleryItemInput): GalleryItem;
  static toDomain(
    source: PrismaGalleryItem | CreateGalleryItemRequestDto | GalleryItem | SeedGalleryItemInput,
    param2?: string | UpdateGalleryItemInput,
    param3: string | null = null
  ): GalleryItem {
    if (source instanceof GalleryItem && typeof param2 === 'object' && param2 !== null) {
      const updates = param2 as UpdateGalleryItemInput;
      return new GalleryItem(
        source.id,
        updates.title !== undefined ? updates.title.trim() : source.title,
        updates.category !== undefined ? updates.category.toLowerCase().trim() : source.category,
        updates.imageUrl !== undefined ? updates.imageUrl.trim() : source.imageUrl,
        updates.imageKey !== undefined ? updates.imageKey : source.imageKey,
        updates.description !== undefined ? (updates.description ? updates.description.trim() : null) : source.description,
        updates.author !== undefined ? (updates.author ? updates.author.trim() : null) : source.author,
        updates.aspectRatio !== undefined ? updates.aspectRatio : source.aspectRatio,
        source.createdAt,
        new Date()
      );
    }

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

    if (typeof param2 === 'string') {
      const dto = source as CreateGalleryItemRequestDto;
      return new GalleryItem(
        crypto.randomUUID(),
        dto.title.trim(),
        (dto.category || 'yoga').toLowerCase(),
        param2,
        param3,
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
