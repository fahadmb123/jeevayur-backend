import type {
  ISessionRepository,
  CreateSessionParams,
} from '../../../domain/repositories/auth/session.repository.js';
import type { Session } from '../../../domain/entities/auth/session.entity.js';
import { SessionMapper } from '../../mappers/auth/session.mapper.js';
import { db } from '../../../shared/database/client.js';

export class PrismaSessionRepository implements ISessionRepository {
  async create(params: CreateSessionParams): Promise<Session> {
    const record = await db.session.create({
      data: {
        ...(params.id ? { id: params.id } : {}),
        userId: params.userId,
        tokenHash: params.tokenHash,
        ipAddress: params.ipAddress,
        city: params.city ?? null,
        country: params.country ?? null,
        device: params.device ?? null,
      },
    });
    return SessionMapper.toDomain(record);
  }

  async findByTokenHash(tokenHash: string): Promise<Session | null> {
    const record = await db.session.findUnique({
      where: { tokenHash },
    });
    if (!record) return null;
    return SessionMapper.toDomain(record);
  }

  async findById(id: string): Promise<Session | null> {
    const record = await db.session.findUnique({
      where: { id },
    });
    if (!record) return null;
    return SessionMapper.toDomain(record);
  }

  async findByUserId(userId: number): Promise<Session[]> {
    const records = await db.session.findMany({
      where: { userId },
      orderBy: { lastActiveAt: 'desc' },
    });
    return records.map(SessionMapper.toDomain);
  }

  async updateTokenHash(id: string, newTokenHash: string): Promise<void> {
    await db.session.update({
      where: { id },
      data: {
        tokenHash: newTokenHash,
        lastActiveAt: new Date(),
      },
    });
  }

  async updateLastActive(id: string): Promise<void> {
    await db.session.update({
      where: { id },
      data: {
        lastActiveAt: new Date(),
      },
    });
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await db.session.deleteMany({
      where: { tokenHash },
    });
  }

  async deleteById(id: string): Promise<void> {
    await db.session.delete({
      where: { id },
    });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await db.session.deleteMany({
      where: { userId },
    });
  }
}

