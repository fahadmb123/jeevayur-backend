import type { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';
import { User, type UserRole } from '../../../domain/entities/auth/user.entity.js';
import type { UserResponseDto } from '../../../application/dtos/response/auth/user.dto.js';

const roleMap: Record<PrismaUserRole, UserRole> = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

const reverseRoleMap: Record<UserRole, PrismaUserRole> = {
  patient: 'PATIENT',
  doctor: 'DOCTOR',
  admin: 'ADMIN',
};

export class UserMapper {
  static toDomain(record: PrismaUser): User {
    return new User(
      record.id,
      record.name,
      record.email,
      record.passwordHash,
      roleMap[record.role] ?? 'patient',
      record.createdAt,
      record.passwordResetToken,
      record.passwordResetExpiresAt
    );
  }

  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  static toPersistence(user: User): Omit<PrismaUser, 'id' | 'createdAt'> & { id?: number } {
    return {
      ...(user.id ? { id: user.id } : {}),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: reverseRoleMap[user.role] ?? 'PATIENT',
      passwordResetToken: user.passwordResetToken ?? null,
      passwordResetExpiresAt: user.passwordResetExpiresAt ?? null,
    };
  }
}
