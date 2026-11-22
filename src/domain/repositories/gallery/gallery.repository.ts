import type { GalleryItem } from '../../entities/gallery/galleryItem.entity.js';

export interface IGalleryRepository {
  findAll(category?: string, search?: string): Promise<GalleryItem[]>;
  findById(id: string): Promise<GalleryItem | null>;
  create(item: GalleryItem): Promise<GalleryItem>;
  update(item: GalleryItem): Promise<GalleryItem>;
  delete(id: string): Promise<void>;
  resetDefaults(items: GalleryItem[]): Promise<GalleryItem[]>;
}
