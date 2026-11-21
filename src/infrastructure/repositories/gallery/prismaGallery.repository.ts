import type { IGalleryRepository } from '../../../domain/repositories/gallery/gallery.repository.js';
import type { GalleryItemEntity } from '../../../domain/entities/gallery/galleryItem.entity.js';
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

  async findAll(category?: string, search?: string): Promise<GalleryItemEntity[]> {
    await this.ensureTable();

    const count = await db.galleryItem.count();
    if (count === 0) {
      for (const item of INITIAL_GALLERY_ITEMS) {
        await db.galleryItem.create({
          data: {
            id: item.id,
            title: item.title,
            category: item.category,
            imageUrl: item.imageUrl,
            description: item.description,
            author: item.author,
            aspectRatio: item.aspectRatio,
            createdAt: new Date(item.createdAt),
          },
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

    let results = records.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      imageUrl: r.imageUrl,
      imageKey: r.imageKey,
      description: r.description,
      author: r.author,
      aspectRatio: r.aspectRatio,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

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

  async findById(id: string): Promise<GalleryItemEntity | null> {
    await this.ensureTable();
    const record = await db.galleryItem.findUnique({ where: { id } });
    if (!record) return null;
    return {
      id: record.id,
      title: record.title,
      category: record.category,
      imageUrl: record.imageUrl,
      imageKey: record.imageKey,
      description: record.description,
      author: record.author,
      aspectRatio: record.aspectRatio,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async create(data: {
    id?: string;
    title: string;
    category: string;
    imageUrl: string;
    imageKey?: string | null;
    description?: string | null;
    author?: string | null;
    aspectRatio?: string | null;
    createdAt?: Date;
  }): Promise<GalleryItemEntity> {
    await this.ensureTable();
    const record = await db.galleryItem.create({
      data: {
        id: data.id,
        title: data.title,
        category: data.category,
        imageUrl: data.imageUrl,
        imageKey: data.imageKey,
        description: data.description,
        author: data.author || 'Doctor / Wellness Admin',
        aspectRatio: data.aspectRatio || 'landscape',
        createdAt: data.createdAt || new Date(),
      },
    });

    return {
      id: record.id,
      title: record.title,
      category: record.category,
      imageUrl: record.imageUrl,
      imageKey: record.imageKey,
      description: record.description,
      author: record.author,
      aspectRatio: record.aspectRatio,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.ensureTable();
    await db.galleryItem.delete({ where: { id } });
  }

  async resetDefaults(initialItems: Array<{
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
    author: string;
    aspectRatio: string;
    createdAt: string;
  }>): Promise<GalleryItemEntity[]> {
    await this.ensureTable();
    await db.galleryItem.deleteMany({});

    for (const item of initialItems) {
      await db.galleryItem.create({
        data: {
          id: item.id,
          title: item.title,
          category: item.category,
          imageUrl: item.imageUrl,
          description: item.description,
          author: item.author,
          aspectRatio: item.aspectRatio,
          createdAt: new Date(item.createdAt),
        },
      });
    }

    const records = await db.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      imageUrl: r.imageUrl,
      imageKey: r.imageKey,
      description: r.description,
      author: r.author,
      aspectRatio: r.aspectRatio,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }
}
