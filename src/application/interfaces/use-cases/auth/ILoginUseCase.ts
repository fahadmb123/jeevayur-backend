import type { LoginRequestDTO } from '../../../dtos/auth/loginRequest.dto.js';
import type { LoginResultDTO } from '../../../dtos/auth/loginResult.dto.js';
import type { IUseCase } from '../IUseCase.js';

export type LoginInput = LoginRequestDTO & { rememberMe?: boolean };

export interface ILoginUseCase extends IUseCase<LoginInput, LoginResultDTO> {
  execute(input: LoginInput): Promise<LoginResultDTO>;
}
