import type { Session as PrismaSession } from '@prisma/client';
import { Session } from '../../../domain/entities/auth/session.entity.js';

export class SessionMapper {
  static toDomain(record: PrismaSession): Session {
    return new Session(
      record.id,
      record.userId,
      record.tokenHash,
      record.ipAddress,
      record.city,
      record.country,
      record.device,
      record.lastActiveAt,
      record.createdAt
    );
  }
}

