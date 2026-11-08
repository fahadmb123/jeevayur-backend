import type { Session } from '../../entities/auth/session.entity.js';

export interface CreateSessionParams {
  id?: string;
  userId: number;
  tokenHash: string;
  ipAddress: string;
  city?: string | null;
  country?: string | null;
  device?: string | null;
}

export interface ISessionRepository {
  create(params: CreateSessionParams): Promise<Session>;
  findByTokenHash(tokenHash: string): Promise<Session | null>;
  findById(id: string): Promise<Session | null>;
  findByUserId(userId: number): Promise<Session[]>;
  updateTokenHash(id: string, newTokenHash: string): Promise<void>;
  updateLastActive(id: string): Promise<void>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByUserId(userId: number): Promise<void>;
}

