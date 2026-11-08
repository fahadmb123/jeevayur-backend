import type { ISocialLinkRepository } from '../../../domain/repositories/social/socialLink.repository.js';
import type { SocialLink } from '../../../domain/entities/social/socialLink.entity.js';
import { db } from '../../../shared/database/client.js';

const INITIAL_DEFAULT_LINKS = [
  { platform: 'instagram', url: 'https://instagram.com/jeevayurniketan', isVisible: true },
  { platform: 'linkedin', url: 'https://linkedin.com/company/jeevayurniketan', isVisible: true },
  { platform: 'facebook', url: 'https://facebook.com/jeevayurniketan', isVisible: true },
  { platform: 'youtube', url: 'https://youtube.com/@jeevayurniketan', isVisible: true },
];

export class PrismaSocialLinkRepository implements ISocialLinkRepository {
  async findAll(onlyVisible?: boolean): Promise<SocialLink[]> {
    const whereClause = onlyVisible ? { isVisible: true } : {};
    let records = await db.socialLink.findMany({ where: whereClause });

    // Auto-seed default sanctuary links on very first load if table is empty
    if (records.length === 0 && !onlyVisible) {
      await db.socialLink.createMany({
        data: INITIAL_DEFAULT_LINKS,
      });
      records = await db.socialLink.findMany();
    }

    return records.map((r) => ({
      id: r.id,
      platform: r.platform,
      url: r.url,
      isVisible: r.isVisible,
    }));
  }

  async findById(id: string): Promise<SocialLink | null> {
    const record = await db.socialLink.findUnique({ where: { id } });
    if (!record) return null;
    return {
      id: record.id,
      platform: record.platform,
      url: record.url,
      isVisible: record.isVisible,
    };
  }

  async create(platform: string, url: string, isVisible = true): Promise<SocialLink> {
    const record = await db.socialLink.create({
      data: {
        platform: platform.toLowerCase().trim(),
        url: url.trim(),
        isVisible,
      },
    });
    return {
      id: record.id,
      platform: record.platform,
      url: record.url,
      isVisible: record.isVisible,
    };
  }

  async update(id: string, platform: string, url: string, isVisible?: boolean): Promise<SocialLink> {
    const record = await db.socialLink.update({
      where: { id },
      data: {
        platform: platform.toLowerCase().trim(),
        url: url.trim(),
        ...(isVisible !== undefined ? { isVisible } : {}),
      },
    });
    return {
      id: record.id,
      platform: record.platform,
      url: record.url,
      isVisible: record.isVisible,
    };
  }

  async delete(id: string): Promise<void> {
    await db.socialLink.delete({ where: { id } });
  }

  async bulkSave(links: Array<{ id?: string; platform: string; url: string; isVisible?: boolean }>): Promise<SocialLink[]> {
    await db.$transaction(async (tx) => {
      const validLinks = links.filter((l) => l.platform && l.url);

      await tx.socialLink.deleteMany({});

      if (validLinks.length > 0) {
        await tx.socialLink.createMany({
          data: validLinks.map((l) => ({
            id: l.id && l.id.length > 10 ? l.id : undefined,
            platform: l.platform.toLowerCase().trim(),
            url: l.url.trim(),
            isVisible: l.isVisible !== false,
          })),
        });
      }
    });

    const records = await db.socialLink.findMany();
    return records.map((r) => ({
      id: r.id,
      platform: r.platform,
      url: r.url,
      isVisible: r.isVisible,
    }));
  }
}
