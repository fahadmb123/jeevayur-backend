import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import type { IUseCase } from '../../../shared/interfaces/use-cases/IUseCase.js';
import type { LoginInputDto } from '../../../application/dtos/auth/request/login.dto.js';
import type { LoginOutputDto } from '../../../application/dtos/auth/response/login.dto.js';
import type { RefreshTokenInputDto } from '../../../application/dtos/auth/request/refreshToken.dto.js';
import type { RefreshTokenOutputDto } from '../../../application/dtos/auth/response/refreshToken.dto.js';
import type { ICookieService } from '../../../shared/interfaces/services/ICookieService.js';
import type { IUserRepository } from '../../../domain/repositories/auth/user.repository.js';
import { UserMapper } from '../../../infrastructure/mappers/auth/user.mapper.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import type { EnvironmentConfig } from '../../../config/environment.config.js';

export class AuthController extends BaseController {
  constructor(
    private readonly _loginUseCase: IUseCase<LoginInputDto, LoginOutputDto>,
    private readonly _refreshTokenUseCase: IUseCase<RefreshTokenInputDto, RefreshTokenOutputDto>,
    private readonly _cookies: ICookieService,
    private readonly _config: EnvironmentConfig,
    private readonly _userRepository?: IUserRepository
  ) {
    super();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._loginUseCase.execute({
        email: req.body.email,
        password: req.body.password,
        rememberMe: req.body.rememberMe,
      });

      this._cookies.setRefreshToken(res, result.refreshToken, result.rememberMe);
      this._cookies.setAccessToken(res, result.accessToken, result.rememberMe);

      this.sendSuccess(res, 'Login successful', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken =
        req.cookies?.[this._config.refreshCookieName] ||
        req.signedCookies?.[this._config.refreshCookieName] ||
        req.body?.refreshToken;

      if (!refreshToken) {
        throw new ApplicationError('TOKEN_REQUIRED', 'Refresh token required', 'AUTHENTICATION');
      }

      const result = await this._refreshTokenUseCase.execute({ refreshToken });

      this._cookies.setRefreshToken(res, result.refreshToken);
      this._cookies.setAccessToken(res, result.accessToken);

      this.sendSuccess(res, 'Token refreshed successfully', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (err) {
      next(err);
    }
  };

  logout = (_req: Request, res: Response): void => {
    this._cookies.clearAuthCookies(res);
    this.sendNoContent(res);
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new ApplicationError('UNAUTHORIZED', 'Authentication required', 'AUTHENTICATION');
      }

      if (this._userRepository) {
        const user = await this._userRepository.findById(req.auth.userId);
        if (user) {
          this.sendSuccess(res, 'Current user retrieved successfully', {
            user: UserMapper.toDto(user),
          });
          return;
        }
      }

      this.sendSuccess(res, 'Current user session retrieved', {
        user: req.auth,
      });
    } catch (err) {
      next(err);
    }
  };
}

