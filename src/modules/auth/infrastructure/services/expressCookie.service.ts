import type { CookieOptions, Response } from 'express';
import type { ICookieService } from '../../../../shared/interfaces/services/ICookieService.js';
import type { EnvironmentConfig } from '../../../../config/environment.config.js';

export class ExpressCookieService implements ICookieService {
  constructor(private readonly config: EnvironmentConfig) {}

  private getBaseCookieOptions(): CookieOptions {
    const options: CookieOptions = {
      httpOnly: this.config.cookieHttpOnly,
      secure: this.config.cookieSecure,
      sameSite: this.config.cookieSameSite,
      path: this.config.cookiePath,
      signed: this.config.cookieSigned,
    };

    if (this.config.cookieDomain) {
      options.domain = this.config.cookieDomain;
    }

    return options;
  }

  public setAccessToken(res: Response, token: string, rememberMe = false): void {
    const options = this.getBaseCookieOptions();

    if (rememberMe) {
      options.maxAge = this.config.rememberMeMaxAge;
    } else if (this.config.cookieSessionMaxAge !== undefined) {
      options.maxAge = this.config.cookieSessionMaxAge;
    }

    res.cookie(this.config.authCookieName, token, options);
  }

  public clearAccessToken(res: Response): void {
    res.clearCookie(this.config.authCookieName, this.getBaseCookieOptions());
  }

  public setRefreshToken(res: Response, token: string, rememberMe = false): void {
    const options = this.getBaseCookieOptions();
    options.path = this.config.refreshCookiePath;
    options.httpOnly = true;

    if (rememberMe) {
      options.maxAge = this.config.rememberMeMaxAge;
    } else {
      options.maxAge = this.config.refreshCookieMaxAge;
    }

    res.cookie(this.config.refreshCookieName, token, options);
  }

  public clearRefreshToken(res: Response): void {
    const options = this.getBaseCookieOptions();
    options.path = this.config.refreshCookiePath;
    res.clearCookie(this.config.refreshCookieName, options);
  }

  public clearAuthCookies(res: Response): void {
    this.clearAccessToken(res);
    this.clearRefreshToken(res);
  }
}
