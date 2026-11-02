import type { UserRole } from '../../../domain/enums/userRole.enum.js';

export interface ITokenService {
  sign(payload: { sub: number; role: UserRole }): Promise<string>;
}
