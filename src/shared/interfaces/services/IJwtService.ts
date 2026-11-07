export interface AuthTokenPayload {
  userId: number;
  role: string;
}

export interface IJwtService {
  generate(payload: AuthTokenPayload): Promise<string> | string;
  generateRefreshToken(payload: AuthTokenPayload): Promise<string> | string;
  signAccessToken?(payload: AuthTokenPayload): Promise<string>;
  signRefreshToken?(payload: AuthTokenPayload): Promise<string>;
  verify(token: string): AuthTokenPayload;
  verifyRefreshToken(token: string): AuthTokenPayload;
}
