import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

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
  })
  .transform((parsed) => ({
    ...parsed,
    COOKIE_SECRET: parsed.COOKIE_SECRET || parsed.AUTH_TOKEN_SECRET,
    AUTH_COOKIE_SECURE:
      parsed.AUTH_COOKIE_SECURE !== undefined
        ? parsed.AUTH_COOKIE_SECURE
        : parsed.NODE_ENV === 'production',
  }));

export type ValidatedEnv = z.infer<typeof envSchema>;

/**
 * Validates the runtime environment against the application schema.
 * Throws a descriptive formatted error if any variables fail validation.
 *
 * @param source Optional raw environment record (defaults to process.env)
 * @returns Fully typed and validated environment object
 */
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
