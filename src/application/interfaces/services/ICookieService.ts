export interface ICookieService {
  setAccessToken(response: unknown, token: string, rememberMe?: boolean): void;
  clearAccessToken(response: unknown): void;
  setRefreshToken(response: unknown, token: string, rememberMe?: boolean): void;
  clearRefreshToken(response: unknown): void;
  clearAuthCookies(response: unknown): void;
}
