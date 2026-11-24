import type { Readable } from 'stream';

export interface StorageFileResult {
  stream: Readable;
  contentType: string;
  contentLength?: number;
}

export interface IStorageService {
  uploadFile(buffer: Buffer, key: string, contentType?: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
  getFile(key: string): Promise<StorageFileResult>;
  getPresignedUrl?(key: string, expiresIn?: number): Promise<string>;
}
