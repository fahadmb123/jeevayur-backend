import type { AuthenticatedUserDTO } from './authenticatedUser.dto.js';

export interface LoginResultDTO {
  user: AuthenticatedUserDTO;
  accessToken: string;
  rememberMe: boolean;
}

