import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
const scrypt = promisify(scryptCallback);
export class ScryptPasswordService {
    async compare(value, hash) {
        const [salt, stored] = hash.split(':');
        if (!salt || !stored)
            return false;
        const derived = (await scrypt(value, salt, 64));
        const expected = Buffer.from(stored, 'hex');
        return expected.length === derived.length && timingSafeEqual(expected, derived);
    }
    async hash(value) {
        const salt = randomBytes(16).toString('hex');
        const derived = (await scrypt(value, salt, 64));
        return `${salt}:${derived.toString('hex')}`;
    }
}
