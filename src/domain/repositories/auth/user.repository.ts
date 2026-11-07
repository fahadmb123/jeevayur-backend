import type { BaseRepository } from '../../../shared/base/repository/baseRepository.js';
import type { User } from '../../entities/auth/user.entity.js';

export interface IUserRepository extends BaseRepository<User> {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPasswordResetToken(tokenHash: string): Promise<User | null>;
  setPasswordResetToken(userId: number, tokenHash: string | null, expiresAt: Date | null): Promise<void>;
  updatePassword(userId: number, newPasswordHash: string): Promise<void>;
}
