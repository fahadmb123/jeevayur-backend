import jwt from 'jsonwebtoken';
import type { ITokenService } from '../../application/interfaces/services/ITokenService.js';
import type { UserRole } from '../../domain/enums/UserRole.js';

export class JwtTokenService implements ITokenService {
  constructor(private readonly secret: string) {}

  public async sign(payload: { sub: number; role: UserRole }): Promise<string> {
    return jwt.sign({ role: payload.role }, this.secret, { subject: String(payload.sub), expiresIn: '7d' });
  }

  public verify(token: string): { userId: number; role: UserRole } {
    const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload & { role: UserRole };
    if (!decoded.sub || !decoded.role) throw new Error('Invalid token');
    return { userId: Number(decoded.sub), role: decoded.role };
  }
}
