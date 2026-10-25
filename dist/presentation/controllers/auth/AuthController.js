import { BaseController } from '../../../shared/controllers/BaseController.js';
import { AppError } from '../../../shared/errors/AppError.js';
export class AuthController extends BaseController {
    loginUseCase;
    cookies;
    constructor(loginUseCase, cookies) {
        super();
        this.loginUseCase = loginUseCase;
        this.cookies = cookies;
    }
    login = async (req, res, next) => {
        try {
            const result = await this.loginUseCase.execute(req.body);
            this.cookies.setAccessToken(res, result.accessToken, result.rememberMe);
            this.sendOk(res, { user: result.user });
        }
        catch (error) {
            next(error);
        }
    };
    logout = (_req, res) => {
        this.cookies.clearAccessToken(res);
        res.status(204).send();
    };
    me = (req, res) => {
        if (!req.auth)
            throw new AppError('Authentication required', 401);
        this.sendOk(res, { user: req.auth });
    };
}
