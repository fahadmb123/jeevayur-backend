import type { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';
import type { User } from '../../../domain/entities/User.js';

const roles = { PATIENT: 'patient', DOCTOR: 'doctor', ADMIN: 'admin' } as const;

export const PrismaUserMapper = {
  toDomain(user: PrismaUser): User {
    return { ...user, role: roles[user.role as PrismaUserRole] };
  },
};
