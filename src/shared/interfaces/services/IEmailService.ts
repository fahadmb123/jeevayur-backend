export interface IEmailService {
  sendPasswordResetEmail(toEmail: string, resetUrl: string, recipientName?: string): Promise<void>;
}

