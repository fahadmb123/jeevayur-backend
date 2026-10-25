export class ExpressCookieService {
    config;
    constructor(config) {
        this.config = config;
    }
    setAccessToken(response, token, rememberMe) {
        const res = response;
        res.cookie(this.config.authCookieName, token, {
            httpOnly: true,
            secure: this.config.nodeEnv === 'production',
            sameSite: this.config.cookieSameSite,
            maxAge: rememberMe ? this.config.rememberMeMaxAge : undefined,
            path: '/',
        });
    }
    clearAccessToken(response) {
        response.clearCookie(this.config.authCookieName, { httpOnly: true, sameSite: this.config.cookieSameSite, path: '/' });
    }
}
