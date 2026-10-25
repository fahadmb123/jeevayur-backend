import type { UserRole } from '../../../domain/enums/UserRole.js';

export interface AuthenticatedUserDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
