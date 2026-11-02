import type { Request } from 'express';
import type { UserRole } from '../../domain/enums/userRole.enum.js';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: number;
    role: UserRole;
  };
}

