import type { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../../shared/controllers/base.controller.js';
import type { ILoginUseCase } from '../../../application/interfaces/use-cases/auth/ILoginUseCase.js';
import type { ExpressCookieService } from '../../../infrastructure/services/expressCookie.service.js';
import type { IUserRepository } from '../../../domain/repositories/user.repository.js';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper.js';
import { AppError } from '../../../shared/errors/app.error.js';

export class AuthController extends BaseController {
  constructor(
    private readonly loginUseCase: ILoginUseCase,
    private readonly cookies: ExpressCookieService,
    private readonly users?: IUserRepository
  ) {
    super();
  }

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

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) throw new AppError('Authentication required', 401);
      if (this.users) {
        const user = await this.users.findById(req.auth.userId);
        if (user) {
          this.sendOk(res, { user: UserMapper.toAuthenticatedUser(user) });
          return;
        }
      }
      this.sendOk(res, { user: req.auth });
    } catch (error) { next(error); }
  };
}

