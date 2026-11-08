import type { UserResponseDto } from '../user/user.dto.js';

export interface RefreshTokenResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}
