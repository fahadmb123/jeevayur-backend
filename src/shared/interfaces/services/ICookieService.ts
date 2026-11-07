import type { Response } from 'express';

export interface ICookieService {
  setAccessToken(res: Response, token: string, rememberMe?: boolean): void;
  setRefreshToken(res: Response, token: string, rememberMe?: boolean): void;
  clearAuthCookies(res: Response): void;
}

