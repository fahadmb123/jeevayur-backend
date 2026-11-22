import type { IYogaRepository } from '../../../domain/repositories/yoga/yoga.repository.js';
import type { YogaSession } from '../../../domain/entities/yoga/yogaSession.entity.js';
import { YogaMapper } from '../../mappers/yoga/yoga.mapper.js';
import { db } from '../../../shared/database/client.js';

export class PrismaYogaRepository implements IYogaRepository {
  private tableEnsured: boolean = false;

  private async ensureTable(): Promise<void> {
    if (this.tableEnsured) return;
    try {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "YogaSession" (
          "id" TEXT PRIMARY KEY NOT NULL,
          "title" TEXT NOT NULL,
          "duration" TEXT NOT NULL DEFAULT '60 mins',
          "format" TEXT NOT NULL DEFAULT 'offline',
          "suitableFor" TEXT NOT NULL DEFAULT 'Beginner (All Ages)',
          "days" TEXT NOT NULL DEFAULT '[]',
          "time" TEXT,
          "scheduleItems" TEXT,
          "description" TEXT NOT NULL,
          "level" TEXT DEFAULT 'Beginner',
          "ageGroup" TEXT,
          "instructor" TEXT,
          "location" TEXT,
          "capacity" INTEGER,
          "enrolledCount" INTEGER NOT NULL DEFAULT 0,
          "price" TEXT,
          "priceAmount" TEXT,
          "priceUnit" TEXT,
          "status" TEXT NOT NULL DEFAULT 'active',
          "imageUrl" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      this.tableEnsured = true;
    } catch {
    }
  }

  async findAll(format?: string, search?: string): Promise<YogaSession[]> {
    await this.ensureTable();

    try {
      if ((db as any).yogaSession) {
        const whereClause: any = {};
        if (format && format !== 'all') {
          whereClause.format = format.toLowerCase();
        }
        if (search && search.trim() !== '') {
          const q = search.trim();
          whereClause.OR = [
            { title: { contains: q } },
            { description: { contains: q } },
            { instructor: { contains: q } },
            { suitableFor: { contains: q } },
          ];
        }
        const records = await (db as any).yogaSession.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        });
        return records.map((record: any) => YogaMapper.toDomain(record));
      }
    } catch {
    }

    let query = `SELECT * FROM "YogaSession" WHERE 1=1`;
    const conditions: string[] = [];

    if (format && format !== 'all') {
      const sanitizedFormat = format.toLowerCase().replace(/['"\\]/g, '');
      conditions.push(`LOWER(format) = '${sanitizedFormat}'`);
    }

    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/['"\\]/g, '');
      conditions.push(`(
        LOWER(title) LIKE '%${sanitized.toLowerCase()}%' OR
        LOWER(description) LIKE '%${sanitized.toLowerCase()}%' OR
        LOWER(instructor) LIKE '%${sanitized.toLowerCase()}%' OR
        LOWER(suitableFor) LIKE '%${sanitized.toLowerCase()}%'
      )`);
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY createdAt DESC`;

    const records = await db.$queryRawUnsafe<any[]>(query);
    return (records || []).map((record) => YogaMapper.toDomain(record));
  }

  async findById(id: string): Promise<YogaSession | null> {
    await this.ensureTable();

    try {
      if ((db as any).yogaSession) {
        const record = await (db as any).yogaSession.findUnique({ where: { id } });
        if (!record) return null;
        return YogaMapper.toDomain(record);
      }
    } catch {
    }

    const records = await db.$queryRawUnsafe<any[]>(
      `SELECT * FROM "YogaSession" WHERE "id" = ? LIMIT 1`,
      id
    );
    if (!records || records.length === 0) return null;
    return YogaMapper.toDomain(records[0]);
  }

  async create(session: YogaSession): Promise<YogaSession> {
    await this.ensureTable();
    const data = YogaMapper.toPersistence(session);

    try {
      if ((db as any).yogaSession) {
        const record = await (db as any).yogaSession.create({ data });
        return YogaMapper.toDomain(record);
      }
    } catch {
    }

    await db.$executeRawUnsafe(
      `INSERT INTO "YogaSession" (
        "id", "title", "duration", "format", "suitableFor", "days", "time", "scheduleItems",
        "description", "level", "ageGroup", "instructor", "location", "capacity",
        "enrolledCount", "price", "priceAmount", "priceUnit", "status", "imageUrl", "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      data.id,
      data.title,
      data.duration,
      data.format,
      data.suitableFor,
      data.days,
      data.time,
      data.scheduleItems,
      data.description,
      data.level,
      data.ageGroup,
      data.instructor,
      data.location,
      data.capacity,
      data.enrolledCount,
      data.price,
      data.priceAmount,
      data.priceUnit,
      data.status,
      data.imageUrl
    );

    return session;
  }

  async update(session: YogaSession): Promise<YogaSession> {
    await this.ensureTable();
    const data = YogaMapper.toPersistence(session);

    try {
      if ((db as any).yogaSession) {
        const record = await (db as any).yogaSession.update({
          where: { id: session.id },
          data,
        });
        return YogaMapper.toDomain(record);
      }
    } catch {
    }

    await db.$executeRawUnsafe(
      `UPDATE "YogaSession" SET
        "title" = ?,
        "duration" = ?,
        "format" = ?,
        "suitableFor" = ?,
        "days" = ?,
        "time" = ?,
        "scheduleItems" = ?,
        "description" = ?,
        "level" = ?,
        "ageGroup" = ?,
        "instructor" = ?,
        "location" = ?,
        "capacity" = ?,
        "enrolledCount" = ?,
        "price" = ?,
        "priceAmount" = ?,
        "priceUnit" = ?,
        "status" = ?,
        "imageUrl" = ?,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ?`,
      data.title,
      data.duration,
      data.format,
      data.suitableFor,
      data.days,
      data.time,
      data.scheduleItems,
      data.description,
      data.level,
      data.ageGroup,
      data.instructor,
      data.location,
      data.capacity,
      data.enrolledCount,
      data.price,
      data.priceAmount,
      data.priceUnit,
      data.status,
      data.imageUrl,
      session.id
    );

    return session;
  }

  async delete(id: string): Promise<void> {
    await this.ensureTable();

    try {
      if ((db as any).yogaSession) {
        await (db as any).yogaSession.delete({ where: { id } });
        return;
      }
    } catch {
    }

    await db.$executeRawUnsafe(`DELETE FROM "YogaSession" WHERE "id" = ?`, id);
  }
}
