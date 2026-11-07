import type { IEmailService } from '../../../shared/interfaces/services/IEmailService.js';
import { Logger } from '../../../shared/logging/Logger.js';

export class EmailService implements IEmailService {
  async sendPasswordResetEmail(
    toEmail: string,
    resetUrl: string,
    recipientName?: string
  ): Promise<void> {
    const greeting = recipientName ? `Hello ${recipientName},` : 'Hello,';
    const message = [
      '=========================================================================',
      '🌿 [Jeevayurniketan Sanctuary] Password Reset Notification',
      '=========================================================================',
      greeting,
      '',
      'You requested a password reset for your Jeevayurniketan account.',
      'Click the secure link below to reset your password:',
      '',
      `👉 ${resetUrl}`,
      '',
      '⏳ Note: This link will expire in 15 minutes for security reasons.',
      'If you did not request this, you can safely ignore this email.',
      '=========================================================================',
    ].join('\n');

    Logger.info(`[EmailService] Dispatching password reset email to: ${toEmail}\n${message}`);
  }
}

