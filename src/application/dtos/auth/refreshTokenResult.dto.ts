import type { AuthenticatedUserDTO } from './authenticatedUser.dto.js';

export interface RefreshTokenResultDTO {
  user: AuthenticatedUserDTO;
  accessToken: string;
  refreshToken: string;
}

