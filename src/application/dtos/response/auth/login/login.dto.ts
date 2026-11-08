import type { UserResponseDto } from '../user/user.dto.js';

export interface LoginOutputDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
}

