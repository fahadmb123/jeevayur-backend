import type { UserResponseDto } from '../user/user.dto.js';

export interface RefreshTokenOutputDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}

