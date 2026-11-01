import type { Response } from 'express';
import type { ICookieService } from '../../application/interfaces/services/ICookieService.js';
import type { EnvironmentConfig } from '../../config/environment.config.js';

export class ExpressCookieService implements ICookieService {
  constructor(private readonly config: EnvironmentConfig) {}

  public setAccessToken(res: Response, token: string, rememberMe = false): void {
    res.cookie(this.config.authCookieName, token, {
      httpOnly: true,
      secure: this.config.nodeEnv === 'production',
      sameSite: this.config.cookieSameSite,
      path: '/',
      ...(rememberMe ? { maxAge: this.config.rememberMeMaxAge } : {}),
    });
  }

  public clearAccessToken(res: Response): void {
    res.clearCookie(this.config.authCookieName, {
      httpOnly: true,
      secure: this.config.nodeEnv === 'production',
      sameSite: this.config.cookieSameSite,
      path: '/',
    });
  }
}
