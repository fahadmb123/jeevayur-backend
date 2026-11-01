import type { Request } from 'express';
import type { UserRole } from '../../domain/enums/UserRole.js';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: number;
    role: UserRole;
  };
}
