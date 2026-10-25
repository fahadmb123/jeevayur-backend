import { BaseRoute } from '../../../shared/routes/BaseRoute.js';
import { validateBody } from '../../../shared/middlewares/ValidationMiddleware.js';
import { loginSchema } from '../../validators/auth/login.schema.js';
import { createAuthMiddleware } from '../../../shared/middlewares/AuthMiddleware.js';
export class AuthRoutes extends BaseRoute {
    controller;
    constructor(controller, tokens, config) {
        super('/auth');
        this.controller = controller;
        this.auth = createAuthMiddleware(tokens, config.authCookieName);
        this.initializeRoutes();
    }
    auth;
    initializeRoutes() {
        this.router.post('/login', validateBody(loginSchema), this.controller.login);
        this.router.post('/logout', this.controller.logout);
        this.router.get('/me', this.auth, this.controller.me);
    }
}
