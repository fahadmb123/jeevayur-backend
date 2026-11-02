import type { UserRole } from '../../../domain/enums/userRole.enum.js';

export interface TokenPayload {
  userId: number;
  role: UserRole;
}

export interface ITokenService {
  signAccessToken(payload: TokenPayload): Promise<string>;
  signRefreshToken(payload: TokenPayload): Promise<string>;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
  sign(payload: { sub: number; role: UserRole }): Promise<string>;
}
