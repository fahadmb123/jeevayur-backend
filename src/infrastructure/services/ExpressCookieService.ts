import type { Response } from 'express';
import type { ICookieService } from '../../application/interfaces/services/ICookieService.js';
import type { EnvironmentConfig } from '../../config/EnvironmentConfig.js';

export class ExpressCookieService implements ICookieService {
  constructor(private readonly config: EnvironmentConfig) {}

  public setAccessToken(response: unknown, token: string, rememberMe: boolean): void {
    const res = response as Response;
    res.cookie(this.config.authCookieName, token, {
      httpOnly: true,
      secure: this.config.nodeEnv === 'production',
      sameSite: this.config.cookieSameSite,
      maxAge: rememberMe ? this.config.rememberMeMaxAge : undefined,
      path: '/',
    });
  }

  public clearAccessToken(response: unknown): void {
    (response as Response).clearCookie(this.config.authCookieName, { httpOnly: true, sameSite: this.config.cookieSameSite, path: '/' });
  }
}
