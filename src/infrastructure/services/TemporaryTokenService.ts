import { createHmac } from 'node:crypto';
import type { ITokenService } from '../../application/interfaces/services/ITokenService.js';
import type { UserRole } from '../../domain/enums/UserRole.js';

export class TemporaryTokenService implements ITokenService {
  constructor(private readonly secret: string) {}

  public async sign(payload: { sub: number; role: UserRole }): Promise<string> {
    const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64url');
    const signature = createHmac('sha256', this.secret).update(body).digest('base64url');
    return `${body}.${signature}`;
  }
}
