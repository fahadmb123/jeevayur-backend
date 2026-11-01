import type { IUserRepository } from '../../domain/repositories/user.repository.js';
import { BaseRepository } from '../../shared/repositories/base.repository.js';
import type { User } from '../../domain/entities/user.entity.js';
import prisma from '../database/prisma.js';
import { PrismaUserMapper } from '../mappers/prismaUser.mapper.js';

export class PrismaUserRepository extends BaseRepository<User> implements IUserRepository {
  public async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }
}

