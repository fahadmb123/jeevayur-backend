import type { UserRole } from '../../../domain/enums/UserRole.js';

export interface AuthResponseDTO {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}
