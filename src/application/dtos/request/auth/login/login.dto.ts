export interface LoginRequestDto {
  email: string;
  password: string;
  rememberMe?: boolean;
  ipAddress?: string;
  device?: string;
  city?: string | null;
  country?: string | null;
}
