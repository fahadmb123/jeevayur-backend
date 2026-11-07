import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import type { IUseCase } from '../../../shared/interfaces/use-cases/IUseCase.js';
import type { LoginInputDto } from '../../../application/dtos/request/auth/login.dto.js';
import type { LoginOutputDto } from '../../../application/dtos/response/auth/login.dto.js';
import type { RefreshTokenInputDto } from '../../../application/dtos/request/auth/refreshToken.dto.js';
import type { RefreshTokenOutputDto } from '../../../application/dtos/response/auth/refreshToken.dto.js';
import type { ForgotPasswordRequestDto } from '../../../application/dtos/request/auth/forgotPassword.dto.js';
import type { RequestPasswordResetOutputDto } from '../../../application/use-cases/auth/authentication/requestPasswordReset.useCase.js';
import type { ResetPasswordRequestDto } from '../../../application/dtos/request/auth/resetPassword.dto.js';
import type { ResetPasswordOutputDto } from '../../../application/use-cases/auth/authentication/resetPassword.useCase.js';
import type { ICookieService } from '../../../shared/interfaces/services/ICookieService.js';
import type { IUserRepository } from '../../../domain/repositories/auth/user.repository.js';
import { UserMapper } from '../../../infrastructure/mappers/auth/user.mapper.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import type { EnvironmentConfig } from '../../../config/environment.config.js';

export class AuthController extends BaseController {
  constructor(
    private readonly _loginUseCase: IUseCase<LoginInputDto, LoginOutputDto>,
    private readonly _refreshTokenUseCase: IUseCase<RefreshTokenInputDto, RefreshTokenOutputDto>,
    private readonly _forgotPasswordUseCase: IUseCase<
      ForgotPasswordRequestDto,
      RequestPasswordResetOutputDto
    >,
    private readonly _resetPasswordUseCase: IUseCase<
      ResetPasswordRequestDto,
      ResetPasswordOutputDto
    >,
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

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._forgotPasswordUseCase.execute({
        email: req.body.email,
      });

      this.sendSuccess(res, result.message);
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._resetPasswordUseCase.execute({
        token: req.body.token,
        newPassword: req.body.newPassword,
      });

      this.sendSuccess(res, result.message);
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
