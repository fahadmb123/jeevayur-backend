export interface IDatabaseHealthService {
  ping(): Promise<boolean>;
}
