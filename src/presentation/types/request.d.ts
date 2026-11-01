import type { UserRole } from '../../domain/enums/UserRole.js';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: number; role: UserRole };
    }
  }
}

export {};
