import type { YogaSession } from '../../entities/yoga/yogaSession.entity.js';

export interface YogaFilterOptions {
  day?: string;
  format?: string;
  level?: string;
  search?: string;
}

export interface IYogaRepository {
  findAll(filters?: YogaFilterOptions): Promise<YogaSession[]>;
  findById(id: string): Promise<YogaSession | null>;
  create(session: YogaSession): Promise<YogaSession>;
  update(session: YogaSession): Promise<YogaSession>;
  delete(id: string): Promise<void>;
}
