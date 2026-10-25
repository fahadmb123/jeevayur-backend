import type { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../../shared/controllers/BaseController.js';
import type { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase.js';
import type { ExpressCookieService } from '../../../infrastructure/services/ExpressCookieService.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class AuthController extends BaseController {
  constructor(private readonly loginUseCase: LoginUseCase, private readonly cookies: ExpressCookieService) { super(); }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      this.cookies.setAccessToken(res, result.accessToken, result.rememberMe);
      this.sendOk(res, { user: result.user });
    } catch (error) { next(error); }
  };

  public logout = (_req: Request, res: Response): void => {
    this.cookies.clearAccessToken(res);
    res.status(204).send();
  };

  public me = (req: Request, res: Response): void => {
    if (!req.auth) throw new AppError('Authentication required', 401);
    this.sendOk(res, { user: req.auth });
  };
}
