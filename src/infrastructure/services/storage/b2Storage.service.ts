import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../../config/environment.config.js';
import { Logger } from '../../../shared/logging/Logger.js';
import type { Readable } from 'stream';

export class B2StorageService {
  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.bucketName = env.b2BucketName || 'jeevayurniketan-media';
    this.client = new S3Client({
      endpoint: env.b2Endpoint || 'https://s3.eu-central-003.backblazeb2.com',
      region: env.b2Region || 'eu-central-003',
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.b2KeyId || '',
        secretAccessKey: env.b2ApplicationKey || '',
      },
    });
  }

  public async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string = 'image/jpeg'
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.client.send(command);
    Logger.info(`[B2StorageService] Uploaded file to B2: ${key}`);
    return key;
  }

  public async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.client.send(command);
      Logger.info(`[B2StorageService] Successfully deleted file from B2: ${key}`);
    } catch (error) {
      Logger.error(`[B2StorageService] Failed to delete file from B2 (${key}):`, error);
    }
  }

  public async getFile(key: string): Promise<{ stream: Readable; contentType: string; contentLength?: number }> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.client.send(command);
    return {
      stream: response.Body as Readable,
      contentType: response.ContentType || 'image/jpeg',
      contentLength: response.ContentLength,
    };
  }

  public async getPresignedUrl(key: string, expiresIn: number = 86400): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }
}
