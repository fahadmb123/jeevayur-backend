import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import type { IPasswordService } from '../../application/interfaces/services/IPasswordService.js';

const scrypt = promisify(scryptCallback);

export class ScryptPasswordService implements IPasswordService {
  public async compare(value: string, hash: string): Promise<boolean> {
    const [salt, stored] = hash.split(':');
    if (!salt || !stored) return false;

    const derived = (await scrypt(value, salt, 64)) as Buffer;
    const expected = Buffer.from(stored, 'hex');
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  }

  public async hash(value: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derived = (await scrypt(value, salt, 64)) as Buffer;
    return `${salt}:${derived.toString('hex')}`;
  }
}
