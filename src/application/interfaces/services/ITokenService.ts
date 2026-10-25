import type { UserRole } from '../../../domain/enums/UserRole.js';

export interface ITokenService {
  sign(payload: { sub: number; role: UserRole }): Promise<string>;
}
