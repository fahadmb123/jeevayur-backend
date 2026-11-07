import type { UserRole } from '../../../../domain/auth/entities/user.entity.js';

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
}
