import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/controller/baseController.js';
import type { IUseCase } from '../../../shared/interfaces/use-cases/IUseCase.js';
import type { LoginInputDto } from '../../../application/dtos/request/auth/login/login.dto.js';
import type { LoginOutputDto } from '../../../application/dtos/response/auth/login/login.dto.js';
import type { RefreshTokenInputDto } from '../../../application/dtos/request/auth/refresh-token/refreshToken.dto.js';
import type { RefreshTokenOutputDto } from '../../../application/dtos/response/auth/refresh-token/refreshToken.dto.js';
import type { ForgotPasswordRequestDto } from '../../../application/dtos/request/auth/forgot-password/forgotPassword.dto.js';
import type { RequestPasswordResetOutputDto } from '../../../application/use-cases/auth/forgot-password/requestPasswordReset.useCase.js';
import type { ResetPasswordRequestDto } from '../../../application/dtos/request/auth/reset-password/resetPassword.dto.js';
import type { ResetPasswordOutputDto } from '../../../application/use-cases/auth/reset-password/resetPassword.useCase.js';
import type { ICookieService } from '../../../shared/interfaces/services/ICookieService.js';
import type { IUserRepository } from '../../../domain/repositories/auth/user.repository.js';
import type { ISessionRepository } from '../../../domain/repositories/auth/session.repository.js';
import { UserMapper } from '../../../infrastructure/mappers/auth/user.mapper.js';
import { ApplicationError } from '../../../shared/errors/applicationError.js';
import type { EnvironmentConfig } from '../../../config/environment.config.js';
import { extractClientInfo } from '../../../shared/utils/clientInfo.js';

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
    private readonly _userRepository?: IUserRepository,
    private readonly _sessionRepository?: ISessionRepository
  ) {
    super();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientInfo = extractClientInfo(req);
      const result = await this._loginUseCase.execute({
        email: req.body.email,
        password: req.body.password,
        rememberMe: req.body.rememberMe,
        ipAddress: clientInfo.ipAddress,
        device: clientInfo.device,
        city: clientInfo.city,
        country: clientInfo.country,
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

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken =
        req.cookies?.[this._config.refreshCookieName] ||
        req.signedCookies?.[this._config.refreshCookieName] ||
        req.body?.refreshToken;

      if (refreshToken && this._sessionRepository) {
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await this._sessionRepository.deleteByTokenHash(tokenHash);
      }
      this._cookies.clearAuthCookies(res);
      this.sendNoContent(res);
    } catch (err) {
      next(err);
    }
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

  getSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new ApplicationError('UNAUTHORIZED', 'Authentication required', 'AUTHENTICATION');
      }

      if (!this._sessionRepository) {
        this.sendSuccess(res, 'Sessions retrieved', { sessions: [] });
        return;
      }

      const sessions = await this._sessionRepository.findByUserId(req.auth.userId);
      this.sendSuccess(res, 'Sessions retrieved successfully', {
        sessions: sessions.map((s) => ({
          id: s.id,
          ipAddress: s.ipAddress,
          device: s.device,
          city: s.city,
          country: s.country,
          lastActiveAt: s.lastActiveAt,
          createdAt: s.createdAt,
        })),
      });
    } catch (err) {
      next(err);
    }
  };

  revokeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new ApplicationError('UNAUTHORIZED', 'Authentication required', 'AUTHENTICATION');
      }

      const rawSessionId = req.params.sessionId;
      const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;
      if (!sessionId || typeof sessionId !== 'string') {
        throw new ApplicationError('VALIDATION_ERROR', 'Session ID is required', 'VALIDATION');
      }

      if (this._sessionRepository) {
        const session = await this._sessionRepository.findById(sessionId);
        if (session && session.userId === req.auth.userId) {
          await this._sessionRepository.deleteById(sessionId);
        }
      }

      this.sendSuccess(res, 'Session revoked successfully');
    } catch (err) {
      next(err);
    }
  };
}
