import { randomBytes } from 'node:crypto';
import type { ITokenService } from '../../application/interfaces/services/ITokenService.js';
import type { UserRole } from '../../domain/enums/userRole.enum.js';

export class TemporaryTokenService implements ITokenService {
  private readonly store = new Map<string, { sub: number; role: UserRole }>();

  public async sign(payload: { sub: number; role: UserRole }): Promise<string> {
    const token = randomBytes(24).toString('hex');
    this.store.set(token, payload);
    return token;
  }

  public verify(token: string): { userId: number; role: UserRole } {
    const payload = this.store.get(token);
    if (!payload) throw new Error('Invalid or expired token');
    return { userId: payload.sub, role: payload.role };
  }
}
