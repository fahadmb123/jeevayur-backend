import jwt from 'jsonwebtoken';
export class JwtTokenService {
    secret;
    constructor(secret) {
        this.secret = secret;
    }
    async sign(payload) {
        return jwt.sign({ role: payload.role }, this.secret, { subject: String(payload.sub), expiresIn: '7d' });
    }
    verify(token) {
        const decoded = jwt.verify(token, this.secret);
        if (!decoded.sub || !decoded.role)
            throw new Error('Invalid token');
        return { userId: Number(decoded.sub), role: decoded.role };
    }
}
