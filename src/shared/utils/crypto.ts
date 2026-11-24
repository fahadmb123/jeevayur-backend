import crypto from 'crypto';

export function hashSha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}
