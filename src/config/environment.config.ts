import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const booleanString = (defaultValue: boolean) =>
  z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const lower = val.trim().toLowerCase();
      if (lower === 'true' || lower === '1') return true;
      if (lower === 'false' || lower === '0') return false;
      if (val.trim() === '') return defaultValue;
    }
    return defaultValue;
  }, z.boolean());

const numberString = (defaultValue: number, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  z.preprocess((val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() !== '') {
      const num = Number(val);
      if (!isNaN(num)) return num;
    }
    return defaultValue;
  }, z.number().min(min).max(max));

const optionalNumberString = () =>
  z.preprocess((val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() !== '') {
      const num = Number(val);
      if (!isNaN(num) && num >= 0) return num;
    }
    return undefined;
  }, z.number().optional());

const optionalTrimmedString = () =>
  z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') {
      return val.trim();
    }
    return undefined;
  }, z.string().optional());

export const envSchema = z
  .object({
    PORT: numberString(7000, 1, 65535),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGIN: z.string().default('http://localhost:5170'),
    FRONTEND_URL: z.string().default('http://localhost:5170'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    TURSO_AUTH_TOKEN: optionalTrimmedString(),
    AUTH_TOKEN_SECRET: z
      .string()
      .min(8, 'AUTH_TOKEN_SECRET must be at least 8 characters')
      .default('development-secret'),
    COOKIE_SECRET: optionalTrimmedString(),
    AUTH_COOKIE_NAME: z.string().min(1).default('jeeva_session'),
    AUTH_COOKIE_HTTP_ONLY: booleanString(true),
    AUTH_COOKIE_SECURE: z.preprocess((val) => {
      if (typeof val === 'boolean') return val;
      if (typeof val === 'string' && val.trim() !== '') {
        const lower = val.trim().toLowerCase();
        if (lower === 'true' || lower === '1') return true;
        if (lower === 'false' || lower === '0') return false;
      }
      return undefined;
    }, z.boolean().optional()),
    AUTH_COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
    AUTH_COOKIE_PATH: z.string().default('/'),
    AUTH_COOKIE_DOMAIN: optionalTrimmedString(),
    AUTH_COOKIE_SIGNED: booleanString(false),
    AUTH_COOKIE_SESSION_MAX_AGE: optionalNumberString(),
    AUTH_COOKIE_REMEMBER_ME_MAX_AGE: numberString(30 * 24 * 60 * 60 * 1000, 0),
    ACCESS_TOKEN_SECRET: optionalTrimmedString(),
    REFRESH_TOKEN_SECRET: optionalTrimmedString(),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
    REFRESH_COOKIE_NAME: z.string().min(1).default('jeeva_refresh'),
    REFRESH_COOKIE_PATH: z.string().default('/'),
    REFRESH_COOKIE_MAX_AGE: numberString(7 * 24 * 60 * 60 * 1000, 0),
    SMTP_HOST: optionalTrimmedString(),
    SMTP_PORT: optionalNumberString(),
    SMTP_USER: optionalTrimmedString(),
    SMTP_PASS: optionalTrimmedString(),
    SMTP_SECURE: booleanString(false),
    SMTP_FROM: z.string().default('Jeevayurniketan Sanctuary <no-reply@jeevayurniketan.com>'),
  })
  .transform((parsed) => ({
    ...parsed,
    COOKIE_SECRET: parsed.COOKIE_SECRET || parsed.AUTH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET: parsed.ACCESS_TOKEN_SECRET || parsed.AUTH_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: parsed.REFRESH_TOKEN_SECRET || `${parsed.AUTH_TOKEN_SECRET}-refresh`,
    AUTH_COOKIE_SECURE:
      parsed.AUTH_COOKIE_SECURE !== undefined
        ? parsed.AUTH_COOKIE_SECURE
        : parsed.NODE_ENV === 'production',
  }));

export type ValidatedEnv = z.infer<typeof envSchema>;

export function validateEnv(source: Record<string, unknown> = process.env): ValidatedEnv {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('\n');

    const errorMessage = `❌ [Config Error] Invalid environment variables:\n${formattedErrors}`;
    console.error(`\n${errorMessage}\n`);
    throw new Error(errorMessage);
  }

  return result.data;
}

export type NodeEnvironment = 'development' | 'production' | 'test';

export class EnvironmentConfig {
  public readonly port: number;
  public readonly nodeEnv: NodeEnvironment;
  public readonly corsOrigin: string;
  public readonly frontendUrl: string;
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
  public readonly accessTokenSecret: string;
  public readonly refreshTokenSecret: string;
  public readonly accessTokenExpiresIn: string;
  public readonly refreshTokenExpiresIn: string;
  public readonly refreshCookieName: string;
  public readonly refreshCookiePath: string;
  public readonly refreshCookieMaxAge: number;
  public readonly smtpHost?: string;
  public readonly smtpPort?: number;
  public readonly smtpUser?: string;
  public readonly smtpPass?: string;
  public readonly smtpSecure: boolean;
  public readonly smtpFrom: string;
  public readonly raw: ValidatedEnv;

  constructor(customSource?: Record<string, unknown>) {
    const validated = validateEnv(customSource);
    this.raw = validated;

    this.port = validated.PORT;
    this.nodeEnv = validated.NODE_ENV;
    this.corsOrigin = validated.CORS_ORIGIN;
    this.frontendUrl = validated.FRONTEND_URL;
    this.databaseUrl = validated.DATABASE_URL;
    this.tursoAuthToken = validated.TURSO_AUTH_TOKEN;
    this.tokenSecret = validated.ACCESS_TOKEN_SECRET;
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
    this.accessTokenSecret = validated.ACCESS_TOKEN_SECRET;
    this.refreshTokenSecret = validated.REFRESH_TOKEN_SECRET;
    this.accessTokenExpiresIn = validated.ACCESS_TOKEN_EXPIRES_IN;
    this.refreshTokenExpiresIn = validated.REFRESH_TOKEN_EXPIRES_IN;
    this.refreshCookieName = validated.REFRESH_COOKIE_NAME;
    this.refreshCookiePath = validated.REFRESH_COOKIE_PATH;
    this.refreshCookieMaxAge = validated.REFRESH_COOKIE_MAX_AGE;
    this.smtpHost = validated.SMTP_HOST;
    this.smtpPort = validated.SMTP_PORT || 587;
    this.smtpUser = validated.SMTP_USER;
    this.smtpPass = validated.SMTP_PASS;
    this.smtpSecure = validated.SMTP_SECURE;
    this.smtpFrom = validated.SMTP_FROM;
  }

  public static validate(source?: Record<string, unknown>): ValidatedEnv {
    return validateEnv(source);
  }

  public static load(customSource?: Record<string, unknown>): EnvironmentConfig {
    return new EnvironmentConfig(customSource);
  }
}

export const env = new EnvironmentConfig();
