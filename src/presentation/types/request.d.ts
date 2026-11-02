import type { UserRole } from '../../domain/enums/userRole.enum.js';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: number; role: UserRole };
    }
  }
}

export {};

