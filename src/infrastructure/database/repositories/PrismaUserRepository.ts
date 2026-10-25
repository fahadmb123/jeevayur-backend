import type { IUserRepository } from '../../../application/interfaces/repositories/IUserRepository.js';
import { BaseRepository } from '../../../shared/repositories/BaseRepository.js';
import type { User } from '../../../domain/entities/User.js';
import prisma from '../prisma.js';
import { PrismaUserMapper } from '../mappers/PrismaUserMapper.js';

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
