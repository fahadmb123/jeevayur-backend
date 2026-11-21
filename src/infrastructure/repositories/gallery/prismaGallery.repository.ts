import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { GalleryItem } from '../../../domain/entities/gallery/galleryItem.entity.js';
import { GalleryMapper } from '../../mappers/gallery/gallery.mapper.js';
import { db } from '../../../shared/database/client.js';
import { INITIAL_GALLERY_ITEMS } from '../../../presentation/controllers/gallery/gallery.constants.js';

export class PrismaGalleryRepository implements IGalleryRepository {
  private tableEnsured: boolean = false;

  private async ensureTable(): Promise<void> {
    if (this.tableEnsured) return;
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "GalleryItem" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "title" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "imageKey" TEXT,
          "description" TEXT,
          "author" TEXT DEFAULT 'Doctor / Wellness Admin',
          "aspectRatio" TEXT DEFAULT 'landscape',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      this.tableEnsured = true;
    } catch {
    }
  }

  async findAll(category?: string, search?: string): Promise<GalleryItem[]> {
    await this.ensureTable();

    const count = await db.galleryItem.count();
    if (count === 0) {
      for (const item of INITIAL_GALLERY_ITEMS) {
        const entity = GalleryMapper.toDomainFromInitial(item);
        const persistenceData = GalleryMapper.toPersistence(entity);
        await db.galleryItem.create({
          data: persistenceData,
        });
      }
    }

    const whereClause: any = {};
    if (category && category !== 'all') {
      whereClause.category = category.toLowerCase();
    }

    const records = await db.galleryItem.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    let results = records.map((record) => GalleryMapper.toDomain(record));

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.author && item.author.toLowerCase().includes(q))
      );
    }

    return results;
  }

  async findById(id: string): Promise<GalleryItem | null> {
    await this.ensureTable();
    const record = await db.galleryItem.findUnique({ where: { id } });
    if (!record) return null;
    return GalleryMapper.toDomain(record);
  }

  async create(item: GalleryItem): Promise<GalleryItem> {
    await this.ensureTable();
    const persistenceData = GalleryMapper.toPersistence(item);
    const record = await db.galleryItem.create({
      data: persistenceData,
    });

    return GalleryMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.ensureTable();
    await db.galleryItem.delete({ where: { id } });
  }

  async resetDefaults(items: GalleryItem[]): Promise<GalleryItem[]> {
    await this.ensureTable();
    await db.galleryItem.deleteMany({});

    for (const item of items) {
      const persistenceData = GalleryMapper.toPersistence(item);
      await db.galleryItem.create({
        data: persistenceData,
      });
    }

    const records = await db.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => GalleryMapper.toDomain(record));
  }
}
