import type { UserResponseDto } from '../user/user.dto.js';

export interface LoginResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
}
