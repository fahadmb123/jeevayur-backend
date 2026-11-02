import { randomBytes } from 'node:crypto';
import type { ITokenService, TokenPayload } from '../../application/interfaces/services/ITokenService.js';
import type { UserRole } from '../../domain/enums/userRole.enum.js';

export class TemporaryTokenService implements ITokenService {
  private readonly store = new Map<string, { sub: number; role: UserRole; type: 'access' | 'refresh' }>();

  public async signAccessToken(payload: TokenPayload): Promise<string> {
    const token = randomBytes(24).toString('hex');
    this.store.set(token, { sub: payload.userId, role: payload.role, type: 'access' });
    return token;
  }

  public async signRefreshToken(payload: TokenPayload): Promise<string> {
    const token = randomBytes(32).toString('hex');
    this.store.set(token, { sub: payload.userId, role: payload.role, type: 'refresh' });
    return token;
  }

  public verifyAccessToken(token: string): TokenPayload {
    const payload = this.store.get(token);
    if (!payload || payload.type !== 'access') throw new Error('Invalid or expired access token');
    return { userId: payload.sub, role: payload.role };
  }

  public verifyRefreshToken(token: string): TokenPayload {
    const payload = this.store.get(token);
    if (!payload || payload.type !== 'refresh') throw new Error('Invalid or expired refresh token');
    return { userId: payload.sub, role: payload.role };
  }

  public async sign(payload: { sub: number; role: UserRole }): Promise<string> {
    return this.signAccessToken({ userId: payload.sub, role: payload.role });
  }

  public verify(token: string): { userId: number; role: UserRole } {
    return this.verifyAccessToken(token);
  }
}
