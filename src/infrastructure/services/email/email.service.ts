import type { IEmailService } from '../../../shared/interfaces/services/IEmailService.js';
import type { EnvironmentConfig } from '../../../config/environment.config.js';
import { Logger } from '../../../shared/logging/Logger.js';

export class EmailService implements IEmailService {
  private readonly _apiKey?: string;
  private readonly _senderEmail?: string;
  private readonly _senderName: string;

  constructor(private readonly _config?: EnvironmentConfig) {
    this._apiKey = this._config?.brevoApiKey;
    this._senderEmail = this._config?.brevoSenderEmail;
    this._senderName = this._config?.brevoSenderName || 'Jeevayurniketan Sanctuary';
  }

  async sendPasswordResetEmail(
    toEmail: string,
    resetUrl: string,
    recipientName?: string
  ): Promise<void> {
    const name = recipientName || 'Valued Patient';
    const senderEmail = this._senderEmail || 'no-reply@jeevayurniketan.com';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Jeevayurniketan Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAF8; font-family: 'Trebuchet MS', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #14241C;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAF8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8DE; box-shadow: 0 4px 20px rgba(18, 76, 56, 0.06);">
          
          <!-- Sanctuary Header Banner -->
          <tr>
            <td style="background-color: #0B3326; padding: 36px 32px 30px; text-align: center; border-bottom: 3px solid #C98D3B;">
              <h1 style="margin: 0; color: #EDF7F2; font-size: 24px; font-weight: 700; letter-spacing: -0.01em;">
                Jeevayurniketan
              </h1>
              <p style="margin: 6px 0 0; color: #41BA91; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;">
                Ayurveda & Psychotherapy Sanctuary
              </p>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 40px 36px 32px;">
              <h2 style="margin: 0 0 16px; color: #0B3326; font-size: 20px; font-weight: 600;">
                Password Reset Request
              </h2>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #485E53;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #485E53;">
                We received a request to reset the password for your Jeevayurniketan sanctuary account. Please click the button below to choose a new password:
              </p>

              <!-- Reset Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 32px;">
                <tr>
                  <td align="center" style="background-color: #1B6B50; border-radius: 999px;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 999px; letter-spacing: 0.01em;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Expiry Notice -->
              <div style="background-color: #EDF6F1; border: 1px solid rgba(27, 107, 80, 0.18); border-radius: 12px; padding: 16px 20px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #1B6B50; font-weight: 600;">
                  ⏳ Security Notice:
                </p>
                <p style="margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #124C38;">
                  This link is cryptographically signed, valid for <strong>15 minutes only</strong>, and can only be used once. If you did not request this, no action is needed and your account remains safe.
                </p>
              </div>

              <!-- Fallback Link -->
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #7E9387;">
                If the button above does not work, copy and paste this secure URL into your browser:<br>
                <a href="${resetUrl}" style="color: #1B6B50; word-break: break-all; text-decoration: underline;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F3F6F1; padding: 24px 36px; border-top: 1px solid #E2E8DE; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #7E9387;">
                Jeevayurniketan • Classical Caraka Samhita & Smriti Meditation
              </p>
              <p style="margin: 0; font-size: 11px; color: #A6C2B4;">
                This is an automated system email. Please do not reply directly to this address.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const textContent = [
      'Jeevayurniketan Ayurveda Sanctuary - Password Reset',
      '==================================================',
      `Hello ${name},`,
      '',
      'We received a request to reset your password.',
      'Click or open this secure link within 15 minutes to reset your password:',
      resetUrl,
      '',
      'If you did not request this, please disregard this email.',
    ].join('\n');

    if (this._apiKey) {
      try {
        Logger.info(`[EmailService] Sending transactional email via Brevo API to: ${toEmail}`);

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'api-key': this._apiKey,
          },
          body: JSON.stringify({
            sender: {
              name: this._senderName,
              email: senderEmail,
            },
            to: [
              {
                email: toEmail,
                name,
              },
            ],
            subject: 'Reset your Jeevayurniketan password (valid for 15 minutes)',
            htmlContent,
            textContent,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          Logger.error(`[EmailService] Brevo API error (${response.status}): ${errorBody}`);
          throw new Error(`Brevo email delivery failed: ${response.statusText}`);
        }

        const data = await response.json();
        Logger.info(
          `[EmailService] Password reset email successfully dispatched via Brevo (messageId: ${(data as { messageId?: string }).messageId || 'unknown'})`
        );
        return;
      } catch (err: unknown) {
        Logger.error(
          `[EmailService] Failed to dispatch Brevo email: ${err instanceof Error ? err.message : String(err)}`
        );
        throw new Error(
          'Email delivery failed. Please check your Brevo configuration or try again later.'
        );
      }
    }

    Logger.warn(
      `[EmailService] BREVO_API_KEY not configured in .env. Falling back to local console dispatch:\nTo: ${toEmail}\nReset URL: ${resetUrl}`
    );
  }
}
