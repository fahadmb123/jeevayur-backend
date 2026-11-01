import type { IBaseRepository } from './base.repository.interface.js';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  abstract findById(id: number): Promise<T | null>;
}

