import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import type { IPasswordHasher } from '../../../../shared/interfaces/services/IPasswordHasher.service.js';

const scrypt = promisify(scryptCallback);

export class ScryptPasswordService implements IPasswordHasher {
  public async compare(plainText: string, hashed: string): Promise<boolean> {
    const [salt, stored] = hashed.split(':');
    if (!salt || !stored) return false;

    const derived = (await scrypt(plainText, salt, 64)) as Buffer;
    const expected = Buffer.from(stored, 'hex');
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  }

  public async hash(plainText: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derived = (await scrypt(plainText, salt, 64)) as Buffer;
    return `${salt}:${derived.toString('hex')}`;
  }
}
