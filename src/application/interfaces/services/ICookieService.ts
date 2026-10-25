export interface ICookieService {
  setAccessToken(response: unknown, token: string, rememberMe: boolean): void;
  clearAccessToken(response: unknown): void;
}
