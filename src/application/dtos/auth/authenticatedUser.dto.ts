import type { UserRole } from '../../../domain/enums/userRole.enum.js';

export interface AuthenticatedUserDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

