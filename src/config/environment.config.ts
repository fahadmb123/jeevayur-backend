import dotenv from 'dotenv';

dotenv.config();

export type NodeEnvironment = 'development' | 'production' | 'test';

export class EnvironmentConfig {
  public readonly port: number;
  public readonly nodeEnv: NodeEnvironment;
  public readonly corsOrigin: string;
  public readonly tokenSecret: string;
  public readonly cookieSecret: string;
  public readonly authCookieName: string;
  public readonly cookieHttpOnly: boolean;
  public readonly cookieSecure: boolean;
  public readonly cookieSameSite: 'lax' | 'strict' | 'none';
  public readonly cookiePath: string;
  public readonly cookieDomain: string | undefined;
  public readonly cookieSigned: boolean;
  public readonly cookieSessionMaxAge: number | undefined;
  public readonly rememberMeMaxAge: number;

  constructor() {
    this.port = this.extractPort(process.env.PORT, 7000);
    this.nodeEnv = this.extractNodeEnv(process.env.NODE_ENV);
    this.corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5170';
    this.tokenSecret = process.env.AUTH_TOKEN_SECRET || 'development-secret';
    this.cookieSecret = process.env.COOKIE_SECRET || this.tokenSecret;
    this.authCookieName = process.env.AUTH_COOKIE_NAME || 'jeeva_session';
    this.cookieHttpOnly = this.extractBoolean(process.env.AUTH_COOKIE_HTTP_ONLY, true);
    this.cookieSecure = this.extractBoolean(
      process.env.AUTH_COOKIE_SECURE,
      this.nodeEnv === 'production'
    );
    this.cookieSameSite = this.extractSameSite(process.env.AUTH_COOKIE_SAME_SITE, 'lax');
    this.cookiePath = process.env.AUTH_COOKIE_PATH || '/';
    this.cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;
    this.cookieSigned = this.extractBoolean(process.env.AUTH_COOKIE_SIGNED, false);
    this.cookieSessionMaxAge = this.extractOptionalNumber(process.env.AUTH_COOKIE_SESSION_MAX_AGE);
    this.rememberMeMaxAge = this.extractNumber(
      process.env.AUTH_COOKIE_REMEMBER_ME_MAX_AGE,
      30 * 24 * 60 * 60 * 1000
    );
  }

  private extractPort(value: string | undefined, defaultPort: number): number {
    if (!value) return defaultPort;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed <= 0 || parsed > 65535) {
      return defaultPort;
    }
    return parsed;
  }

  private extractNodeEnv(value: string | undefined): NodeEnvironment {
    if (value === 'production' || value === 'test') {
      return value;
    }
    return 'development';
  }

  private extractBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    return value.toLowerCase() === 'true' || value === '1';
  }

  private extractSameSite(
    value: string | undefined,
    defaultValue: 'lax' | 'strict' | 'none'
  ): 'lax' | 'strict' | 'none' {
    if (value === 'none' || value === 'strict' || value === 'lax') {
      return value;
    }
    return defaultValue;
  }

  private extractNumber(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) || parsed < 0 ? defaultValue : parsed;
  }

  private extractOptionalNumber(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) || parsed < 0 ? undefined : parsed;
  }
}

export const env = new EnvironmentConfig();
