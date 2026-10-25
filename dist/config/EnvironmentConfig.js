import dotenv from 'dotenv';
dotenv.config();
export class EnvironmentConfig {
    port;
    nodeEnv;
    corsOrigin;
    tokenSecret;
    authCookieName;
    cookieSameSite;
    rememberMeMaxAge;
    constructor() {
        this.port = this.extractPort(process.env.PORT, 7000);
        this.nodeEnv = this.extractNodeEnv(process.env.NODE_ENV);
        this.corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5170';
        this.tokenSecret = process.env.AUTH_TOKEN_SECRET || 'development-secret';
        this.authCookieName = process.env.AUTH_COOKIE_NAME || 'jeeva_session';
        this.cookieSameSite = process.env.AUTH_COOKIE_SAME_SITE === 'none' ? 'none' : process.env.AUTH_COOKIE_SAME_SITE === 'strict' ? 'strict' : 'lax';
        this.rememberMeMaxAge = 30 * 24 * 60 * 60 * 1000;
    }
    extractPort(value, defaultPort) {
        if (!value)
            return defaultPort;
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed <= 0 || parsed > 65535) {
            return defaultPort;
        }
        return parsed;
    }
    extractNodeEnv(value) {
        if (value === 'production' || value === 'test') {
            return value;
        }
        return 'development';
    }
}
export const env = new EnvironmentConfig();
