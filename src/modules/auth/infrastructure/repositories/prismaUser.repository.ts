import type { IUserRepository } from '../../domain/repositories/user.repository.js';
import type { User } from '../../domain/entities/user.entity.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { db } from '../../../../shared/database/client.js';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const record = await db.user.findUnique({ where: { id } });
    if (!record) return null;
    return UserMapper.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await db.user.findUnique({ where: { email } });
    if (!record) return null;
    return UserMapper.toDomain(record);
  }
}

