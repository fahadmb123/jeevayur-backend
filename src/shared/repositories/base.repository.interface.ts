export interface IBaseRepository<T> {
  findById(id: number): Promise<T | null>;
}
