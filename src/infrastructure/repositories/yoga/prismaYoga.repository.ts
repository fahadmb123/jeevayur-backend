import type { IYogaRepository, YogaFilterOptions } from '../../../domain/repositories/yoga/yoga.repository.js';
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

  async findAll(filters?: YogaFilterOptions): Promise<YogaSession[]> {
    await this.ensureTable();

    const format = filters?.format;
    const day = filters?.day;
    const level = filters?.level;
    const search = filters?.search;

    try {
      if ((db as any).yogaSession) {
        const andConditions: any[] = [];

        if (format && format.toLowerCase() !== 'all') {
          andConditions.push({ format: format.toLowerCase() });
        }

        if (day && day.toLowerCase() !== 'all') {
          andConditions.push({ days: { contains: day } });
        }

        if (level && level.toLowerCase() !== 'all') {
          andConditions.push({
            OR: [
              { level: { contains: level } },
              { suitableFor: { contains: level } },
            ],
          });
        }

        if (search && search.trim() !== '') {
          const q = search.trim();
          andConditions.push({
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { instructor: { contains: q } },
              { suitableFor: { contains: q } },
              { location: { contains: q } },
            ],
          });
        }

        const whereClause = andConditions.length > 0 ? { AND: andConditions } : {};
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

    if (format && format.toLowerCase() !== 'all') {
      const sanitizedFormat = format.toLowerCase().replace(/['"\\]/g, '');
      conditions.push(`LOWER(format) = '${sanitizedFormat}'`);
    }

    if (day && day.toLowerCase() !== 'all') {
      const sanitizedDay = day.replace(/['"\\]/g, '');
      conditions.push(`(days LIKE '%"${sanitizedDay}"%' OR days LIKE '%${sanitizedDay}%')`);
    }

    if (level && level.toLowerCase() !== 'all') {
      const sanitizedLevel = level.toLowerCase().replace(/['"\\]/g, '');
      conditions.push(`(LOWER(level) LIKE '%${sanitizedLevel}%' OR LOWER(suitableFor) LIKE '%${sanitizedLevel}%')`);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase().replace(/['"\\]/g, '');
      conditions.push(`(
        LOWER(title) LIKE '%${q}%' OR
        LOWER(description) LIKE '%${q}%' OR
        LOWER(instructor) LIKE '%${q}%' OR
        LOWER(suitableFor) LIKE '%${q}%' OR
        LOWER(location) LIKE '%${q}%'
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
