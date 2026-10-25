export interface IPasswordService {
  compare(value: string, hash: string): Promise<boolean>;
}
