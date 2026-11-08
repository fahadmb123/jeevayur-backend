import type { ISocialLinkRepository } from '../../../domain/repositories/social/socialLink.repository.js';
import type { SocialLink } from '../../../domain/entities/social/socialLink.entity.js';
import { db } from '../../../shared/database/client.js';

const INITIAL_DEFAULT_LINKS = [
  { platform: 'instagram', url: 'https://instagram.com/jeevayurniketan' },
  { platform: 'linkedin', url: 'https://linkedin.com/company/jeevayurniketan' },
  { platform: 'facebook', url: 'https://facebook.com/jeevayurniketan' },
  { platform: 'youtube', url: 'https://youtube.com/@jeevayurniketan' },
];

export class PrismaSocialLinkRepository implements ISocialLinkRepository {
  async findAll(): Promise<SocialLink[]> {
    let records = await db.socialLink.findMany();

    // Auto-seed default sanctuary links on very first load if table is empty
    if (records.length === 0) {
      await db.socialLink.createMany({
        data: INITIAL_DEFAULT_LINKS,
      });
      records = await db.socialLink.findMany();
    }

    return records.map((r) => ({
      id: r.id,
      platform: r.platform,
      url: r.url,
    }));
  }

  async findById(id: string): Promise<SocialLink | null> {
    const record = await db.socialLink.findUnique({ where: { id } });
    if (!record) return null;
    return {
      id: record.id,
      platform: record.platform,
      url: record.url,
    };
  }

  async create(platform: string, url: string): Promise<SocialLink> {
    const record = await db.socialLink.create({
      data: {
        platform: platform.toLowerCase().trim(),
        url: url.trim(),
      },
    });
    return {
      id: record.id,
      platform: record.platform,
      url: record.url,
    };
  }

  async update(id: string, platform: string, url: string): Promise<SocialLink> {
    const record = await db.socialLink.update({
      where: { id },
      data: {
        platform: platform.toLowerCase().trim(),
        url: url.trim(),
      },
    });
    return {
      id: record.id,
      platform: record.platform,
      url: record.url,
    };
  }

  async delete(id: string): Promise<void> {
    await db.socialLink.delete({ where: { id } });
  }

  async bulkSave(links: Array<{ id?: string; platform: string; url: string }>): Promise<SocialLink[]> {
    // Delete existing links not in the payload or perform atomic transaction
    await db.$transaction(async (tx) => {
      // If links are provided, synchronize them
      const validLinks = links.filter((l) => l.platform && l.url);
      
      // Delete all existing and re-insert or upsert
      await tx.socialLink.deleteMany({});
      
      if (validLinks.length > 0) {
        await tx.socialLink.createMany({
          data: validLinks.map((l) => ({
            id: l.id && l.id.length > 10 ? l.id : undefined,
            platform: l.platform.toLowerCase().trim(),
            url: l.url.trim(),
          })),
        });
      }
    });

    return this.findAll();
  }
}
