import jwt from 'jsonwebtoken';
import type { IJwtService, AuthTokenPayload } from '../../../shared/interfaces/services/IJwtService.js';
import type { UserRole } from '../../../domain/entities/auth/user.entity.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';

export interface JwtTokenServiceOptions {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn?: string;
  refreshTokenExpiresIn?: string;
}

export class JwtTokenService implements IJwtService {
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

  public generate(payload: AuthTokenPayload): string {
    return jwt.sign(
      { role: payload.role, type: 'access' },
      this.accessTokenSecret,
      {
        subject: String(payload.userId),
        expiresIn: this.accessTokenExpiresIn as jwt.SignOptions['expiresIn'],
      }
    );
  }

  public generateRefreshToken(payload: AuthTokenPayload): string {
    return jwt.sign(
      { role: payload.role, type: 'refresh' },
      this.refreshTokenSecret,
      {
        subject: String(payload.userId),
        expiresIn: this.refreshTokenExpiresIn as jwt.SignOptions['expiresIn'],
      }
    );
  }

  public verify(token: string): AuthTokenPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as jwt.JwtPayload & { role: UserRole; type?: string };
      if (!decoded.sub || !decoded.role) throw new Error('Invalid token payload');
      if (decoded.type && decoded.type !== 'access') throw new Error('Invalid token type');
      return { userId: Number(decoded.sub), role: decoded.role };
    } catch {
      throw new ApplicationError('INVALID_TOKEN', 'Invalid or expired access token', 'AUTHENTICATION');
    }
  }

  public verifyRefreshToken(token: string): AuthTokenPayload {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as jwt.JwtPayload & { role: UserRole; type?: string };
      if (!decoded.sub || !decoded.role) throw new Error('Invalid token payload');
      if (decoded.type !== 'refresh') throw new Error('Token is not a refresh token');
      return { userId: Number(decoded.sub), role: decoded.role };
    } catch {
      throw new ApplicationError('INVALID_TOKEN', 'Invalid or expired refresh token', 'AUTHENTICATION');
    }
  }
}
