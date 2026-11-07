export interface BaseRepository<T> {
  findById(id: number | string): Promise<T | null>;
}
