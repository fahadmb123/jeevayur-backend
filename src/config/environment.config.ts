import { validateEnv, type ValidatedEnv } from './env.validator.js';

export type NodeEnvironment = 'development' | 'production' | 'test';

export class EnvironmentConfig {
  public readonly port: number;
  public readonly nodeEnv: NodeEnvironment;
  public readonly corsOrigin: string;
  public readonly databaseUrl: string;
  public readonly tursoAuthToken: string | undefined;
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
  public readonly raw: ValidatedEnv;

  constructor(customSource?: Record<string, unknown>) {
    const validated = validateEnv(customSource);
    this.raw = validated;

    this.port = validated.PORT;
    this.nodeEnv = validated.NODE_ENV;
    this.corsOrigin = validated.CORS_ORIGIN;
    this.databaseUrl = validated.DATABASE_URL;
    this.tursoAuthToken = validated.TURSO_AUTH_TOKEN;
    this.tokenSecret = validated.AUTH_TOKEN_SECRET;
    this.cookieSecret = validated.COOKIE_SECRET;
    this.authCookieName = validated.AUTH_COOKIE_NAME;
    this.cookieHttpOnly = validated.AUTH_COOKIE_HTTP_ONLY;
    this.cookieSecure = validated.AUTH_COOKIE_SECURE;
    this.cookieSameSite = validated.AUTH_COOKIE_SAME_SITE;
    this.cookiePath = validated.AUTH_COOKIE_PATH;
    this.cookieDomain = validated.AUTH_COOKIE_DOMAIN;
    this.cookieSigned = validated.AUTH_COOKIE_SIGNED;
    this.cookieSessionMaxAge = validated.AUTH_COOKIE_SESSION_MAX_AGE;
    this.rememberMeMaxAge = validated.AUTH_COOKIE_REMEMBER_ME_MAX_AGE;
  }

  public static validate(source?: Record<string, unknown>): ValidatedEnv {
    return validateEnv(source);
  }

  public static load(customSource?: Record<string, unknown>): EnvironmentConfig {
    return new EnvironmentConfig(customSource);
  }
}

export const env = new EnvironmentConfig();
export { validateEnv, type ValidatedEnv } from './env.validator.js';
