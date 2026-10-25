import type { AuthenticatedUserDTO } from './AuthenticatedUserDTO.js';

export interface LoginResultDTO {
  user: AuthenticatedUserDTO;
  accessToken: string;
  rememberMe: boolean;
}
