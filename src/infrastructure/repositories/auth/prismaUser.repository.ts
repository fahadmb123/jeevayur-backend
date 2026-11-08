import type { IUserRepository } from '../../../domain/repositories/auth/user.repository.js';
import type { User } from '../../../domain/entities/auth/user.entity.js';
import { UserMapper } from '../../mappers/auth/user.mapper.js';
import { db } from '../../../shared/database/client.js';

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

  async findByPasswordResetToken(tokenHash: string): Promise<User | null> {
    const record = await db.user.findFirst({
      where: { passwordResetToken: tokenHash },
    });
    if (!record) return null;
    return UserMapper.toDomain(record);
  }

  async setPasswordResetToken(
    userId: number,
    tokenHash: string | null,
    expiresAt: Date | null
  ): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: tokenHash,
        passwordResetExpiresAt: expiresAt,
      },
    });
  }

  async updatePassword(userId: number, newPasswordHash: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    });
  }

  async updateProfile(
    userId: number,
    data: { name?: string; email?: string; phone?: string | null }
  ): Promise<User> {
    const updated = await db.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
      },
    });
    return UserMapper.toDomain(updated);
  }
}
