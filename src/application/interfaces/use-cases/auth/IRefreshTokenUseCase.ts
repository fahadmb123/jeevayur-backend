import type { IUseCase } from '../IUseCase.js';
import type { RefreshTokenRequestDTO } from '../../../dtos/auth/refreshTokenRequest.dto.js';
import type { RefreshTokenResultDTO } from '../../../dtos/auth/refreshTokenResult.dto.js';

export type IRefreshTokenUseCase = IUseCase<RefreshTokenRequestDTO, RefreshTokenResultDTO>;
