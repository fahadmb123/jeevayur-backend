import { createHmac } from 'node:crypto';
export class TemporaryTokenService {
    secret;
    constructor(secret) {
        this.secret = secret;
    }
    async sign(payload) {
        const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64url');
        const signature = createHmac('sha256', this.secret).update(body).digest('base64url');
        return `${body}.${signature}`;
    }
}
