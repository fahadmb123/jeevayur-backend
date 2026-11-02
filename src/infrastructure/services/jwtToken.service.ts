import jwt from 'jsonwebtoken';
import type { ITokenService, TokenPayload } from '../../application/interfaces/services/ITokenService.js';
import type { UserRole } from '../../domain/enums/userRole.enum.js';
import { AppError } from '../../shared/errors/app.error.js';
import { StatusMessage } from '../../shared/errors/status.mapper.js';

export interface JwtTokenServiceOptions {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn?: string;
  refreshTokenExpiresIn?: string;
}

export class JwtTokenService implements ITokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(options: JwtTokenServiceOptions | string) {
    if (typeof options === 'string') {
      this.accessTokenSecret = options;
      this.refreshTokenSecret = `${options}-refresh`;
      this.accessTokenExpiresIn = '15m';
      this.refreshTokenExpiresIn = '7d';
    } else {
      this.accessTokenSecret = options.accessTokenSecret;
      this.refreshTokenSecret = options.refreshTokenSecret;
      this.accessTokenExpiresIn = options.accessTokenExpiresIn || '15m';
      this.refreshTokenExpiresIn = options.refreshTokenExpiresIn || '7d';
    }
  }

  public async signAccessToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(
      { role: payload.role, type: 'access' },
      this.accessTokenSecret,
      {
        subject: String(payload.userId),
        expiresIn: this.accessTokenExpiresIn as jwt.SignOptions['expiresIn'],
      }
    );
  }

  public async signRefreshToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(
      { role: payload.role, type: 'refresh' },
      this.refreshTokenSecret,
      {
        subject: String(payload.userId),
        expiresIn: this.refreshTokenExpiresIn as jwt.SignOptions['expiresIn'],
      }
    );
  }

  public verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as jwt.JwtPayload & { role: UserRole; type?: string };
      if (!decoded.sub || !decoded.role) throw new Error('Invalid token payload');
      if (decoded.type && decoded.type !== 'access') throw new Error('Invalid token type');
      return { userId: Number(decoded.sub), role: decoded.role };
    } catch {
      throw new AppError(StatusMessage.UNAUTHORIZED, 'Invalid or expired access token');
    }
  }

  public verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as jwt.JwtPayload & { role: UserRole; type?: string };
      if (!decoded.sub || !decoded.role) throw new Error('Invalid token payload');
      if (decoded.type !== 'refresh') throw new Error('Token is not a refresh token');
      return { userId: Number(decoded.sub), role: decoded.role };
    } catch {
      throw new AppError(StatusMessage.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
  }

  public async sign(payload: { sub: number; role: UserRole }): Promise<string> {
    return this.signAccessToken({ userId: payload.sub, role: payload.role });
  }

  public verify(token: string): { userId: number; role: UserRole } {
    return this.verifyAccessToken(token);
  }
}
