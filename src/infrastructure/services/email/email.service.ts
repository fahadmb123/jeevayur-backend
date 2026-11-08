import fs from 'fs';
import path from 'path';
import type { IEmailService, NewLoginAlertParams } from '../../../shared/interfaces/services/IEmailService.js';
import type { EnvironmentConfig } from '../../../config/environment.config.js';
import { Logger } from '../../../shared/logging/Logger.js';

let cachedLogoBase64: string | null = null;

function getLogoBase64(): string | null {
  if (cachedLogoBase64) return cachedLogoBase64;
  try {
    const candidates = [
      path.resolve(process.cwd(), 'assets', 'logo.png'),
      path.resolve(process.cwd(), 'jeevayur-backend', 'assets', 'logo.png'),
      path.resolve(process.cwd(), '..', 'assets', 'logo.png'),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        cachedLogoBase64 = fs.readFileSync(candidate).toString('base64');
        return cachedLogoBase64;
      }
    }
  } catch (err) {
    Logger.warn(`[EmailService] Could not read logo asset: ${err}`);
  }
  return null;
}

function formatDateTime(date: Date): string {
  try {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return date.toUTCString();
  }
}

export class EmailService implements IEmailService {
  private readonly _apiKey?: string;
  private readonly _senderEmail?: string;
  private readonly _senderName: string;

  constructor(private readonly _config?: EnvironmentConfig) {
    this._apiKey = this._config?.brevoApiKey;
    this._senderEmail = this._config?.brevoSenderEmail;
    this._senderName = this._config?.brevoSenderName || 'Jeevayurniketan Sanctuary';
  }

  private _buildHeaderHtml(): string {
    return `
      <!-- Sanctuary Header Banner with Premium Large Brand Logo -->
      <tr>
        <td align="center" style="background: linear-gradient(180deg, #07261E 0%, #0D3A2C 100%); background-color: #0B3326; padding: 42px 32px 34px; text-align: center; border-bottom: 3px solid #C98D3B;">
          <img src="cid:jeevayurniketan-logo.png" alt="Jeevayurniketan Emblem" width="88" height="88" style="display: block; margin: 0 auto 16px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35); border: 2px solid rgba(201, 141, 59, 0.3);" />
          <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
            Jeevayurniketan
          </h1>
          <p style="margin: 8px 0 0; color: #52D8A7; font-size: 12px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;">
            Ayurveda &amp; Psychotherapy Sanctuary
          </p>
        </td>
      </tr>
    `;
  }

  private _buildFooterHtml(): string {
    return `
      <!-- Clinical Sanctuary Footer -->
      <tr>
        <td style="background-color: #F3F6F1; padding: 28px 36px; border-top: 1px solid #E2E8DE; text-align: center;">
          <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #1B4D3A;">
            Jeevayurniketan Healthcare Sanctuary • Clinical Practice of Dr. Ahalya T.S.
          </p>
          <p style="margin: 0 0 8px; font-size: 12px; color: #6E8578;">
            Classical Caraka Samhita • Smriti Psychotherapy • Yoga Cikitsa
          </p>
          <p style="margin: 0; font-size: 11px; color: #9AB2A5; line-height: 1.5;">
            Protected by 256-bit clinical encryption &amp; confidentiality standards.<br>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </td>
      </tr>
    `;
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
<body style="margin: 0; padding: 0; background-color: #F7FAF8; font-family: 'Trebuchet MS', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #14241C;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F7FAF8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8DE; box-shadow: 0 8px 30px rgba(18, 76, 56, 0.08);">
          
          ${this._buildHeaderHtml()}

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 40px 36px 32px;">
              <h2 style="margin: 0 0 16px; color: #0B3326; font-size: 21px; font-weight: 700;">
                Password Reset Request
              </h2>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #485E53;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #485E53;">
                We received a request to reset the password for your Jeevayurniketan sanctuary account. Click the button below to choose a new password:
              </p>

              <!-- Reset Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 32px;">
                <tr>
                  <td align="center" style="background-color: #124C38; border-radius: 10px; box-shadow: 0 4px 14px rgba(18, 76, 56, 0.25);">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 15px 38px; font-size: 15px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 10px; letter-spacing: 0.01em;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Expiry Notice -->
              <div style="background-color: #EDF6F1; border: 1px solid rgba(27, 107, 80, 0.18); border-radius: 12px; padding: 16px 20px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #1B6B50; font-weight: 700;">
                  ⏳ 15-Minute Expiration Notice:
                </p>
                <p style="margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #124C38;">
                  This link is cryptographically signed, valid for <strong>15 minutes only</strong>, and single-use. If you did not request this change, you can safely ignore this email; your account remains secure.
                </p>
              </div>

              <!-- Fallback Link -->
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #7E9387;">
                If the button above does not work, copy and paste this secure URL into your browser:<br>
                <a href="${resetUrl}" style="color: #1B6B50; word-break: break-all; text-decoration: underline;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          ${this._buildFooterHtml()}

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

    await this._sendBrevoEmail({
      toEmail,
      recipientName: name,
      subject: 'Reset your Jeevayurniketan password (valid for 15 minutes)',
      htmlContent,
      textContent,
    });
  }

  async sendNewLoginAlertEmail(params: NewLoginAlertParams): Promise<void> {
    const {
      toEmail,
      recipientName,
      device,
      ipAddress,
      city,
      country,
      loginTime,
      manageSessionsUrl,
    } = params;

    const formattedTime = formatDateTime(loginTime);
    const locationParts = [city, country].filter(Boolean);
    const locationString =
      locationParts.length > 0 ? locationParts.join(', ') : 'Approximate (detected via IP)';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert: New Sign-in to Jeevayurniketan</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7FAF8; font-family: 'Trebuchet MS', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #14241C;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F7FAF8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8DE; box-shadow: 0 8px 30px rgba(18, 76, 56, 0.08);">
          
          ${this._buildHeaderHtml()}

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 40px 36px 32px;">
              
              <!-- Security Badge & Title -->
              <div style="text-align: center; margin-bottom: 28px;">
                <div style="display: inline-block; background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 999px; padding: 6px 18px; margin-bottom: 14px;">
                  <span style="font-size: 12px; font-weight: 700; color: #92400E; letter-spacing: 0.05em; text-transform: uppercase;">
                    🛡️ Security Alert: New Sign-in
                  </span>
                </div>
                <h2 style="margin: 0 0 10px; color: #0B3326; font-size: 22px; font-weight: 700; letter-spacing: -0.01em;">
                  New Sign-In to Your Account
                </h2>
                <p style="margin: 0; font-size: 15px; color: #485E53; line-height: 1.6;">
                  Hello <strong>${recipientName}</strong>, we noticed a new sign-in to your Jeevayurniketan account. Please review the details below:
                </p>
              </div>

              <!-- Structured Metadata Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAF8; border: 1px solid #E2E8DE; border-radius: 14px; overflow: hidden; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #EDF2EC;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="36" valign="top" style="font-size: 18px; line-height: 1;">💻</td>
                        <td>
                          <div style="font-size: 11px; font-weight: 700; color: #768B7F; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">Device &amp; Browser</div>
                          <div style="font-size: 15px; font-weight: 600; color: #11281E;">${device}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #EDF2EC;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="36" valign="top" style="font-size: 18px; line-height: 1;">📍</td>
                        <td>
                          <div style="font-size: 11px; font-weight: 700; color: #768B7F; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">Approximate Location</div>
                          <div style="font-size: 15px; font-weight: 600; color: #11281E;">${locationString}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #EDF2EC;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="36" valign="top" style="font-size: 18px; line-height: 1;">🌐</td>
                        <td>
                          <div style="font-size: 11px; font-weight: 700; color: #768B7F; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">IP Address</div>
                          <div style="font-size: 15px; font-weight: 600; color: #11281E; font-family: monospace;">${ipAddress}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="36" valign="top" style="font-size: 18px; line-height: 1;">🕒</td>
                        <td>
                          <div style="font-size: 11px; font-weight: 700; color: #768B7F; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">Time of Sign-in</div>
                          <div style="font-size: 15px; font-weight: 600; color: #11281E;">${formattedTime}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Unrecognized Warning Block -->
              <div style="background-color: #FFFDF5; border: 1px solid #FDE68A; border-left: 4px solid #D97706; border-radius: 10px; padding: 18px 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #92400E;">
                  Don't recognize this sign-in?
                </p>
                <p style="margin: 0; font-size: 13px; color: #78350F; line-height: 1.55;">
                  If this was not you, someone else may have obtained your password. Please review your active sessions immediately and log out any unrecognized device to protect your account.
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 28px;">
                <tr>
                  <td align="center" style="background-color: #124C38; border-radius: 10px; box-shadow: 0 4px 14px rgba(18, 76, 56, 0.25);">
                    <a href="${manageSessionsUrl}" target="_blank" style="display: inline-block; padding: 15px 38px; font-size: 15px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 10px; letter-spacing: 0.02em;">
                      Review &amp; Log Out Devices
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Reassurance Note -->
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #748A7D; text-align: center;">
                If this was you, you can safely disregard this message. Your session is active and protected.
              </p>

            </td>
          </tr>

          ${this._buildFooterHtml()}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const textContent = [
      'Jeevayurniketan Security Alert - New Sign-in Detected',
      '====================================================',
      `Hello ${recipientName},`,
      '',
      'A new sign-in to your Jeevayurniketan account was detected:',
      `- Device: ${device}`,
      `- Location: ${locationString}`,
      `- IP Address: ${ipAddress}`,
      `- Time: ${formattedTime}`,
      '',
      'If this was you, no action is needed.',
      'If you do not recognize this activity, review your active sessions and log out the device immediately:',
      manageSessionsUrl,
    ].join('\n');

    await this._sendBrevoEmail({
      toEmail,
      recipientName,
      subject: `Security alert: New sign-in to Jeevayurniketan from ${device}`,
      htmlContent,
      textContent,
    });
  }

  private async _sendBrevoEmail(params: {
    toEmail: string;
    recipientName: string;
    subject: string;
    htmlContent: string;
    textContent: string;
  }): Promise<void> {
    const { toEmail, recipientName, subject, htmlContent, textContent } = params;
    const senderEmail = this._senderEmail || 'no-reply@jeevayurniketan.com';

    if (this._apiKey) {
      try {
        Logger.info(`[EmailService] Sending email via Brevo API to: ${toEmail} (${subject})`);

        const logoBase64 = getLogoBase64();
        const attachment = logoBase64
          ? [
              {
                name: 'jeevayurniketan-logo.png',
                content: logoBase64,
              },
            ]
          : undefined;

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
                name: recipientName,
              },
            ],
            subject,
            htmlContent,
            textContent,
            ...(attachment ? { attachment } : {}),
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          Logger.error(`[EmailService] Brevo API error (${response.status}): ${errorBody}`);
          throw new Error(`Brevo email delivery failed: ${response.statusText}`);
        }

        const data = await response.json();
        Logger.info(
          `[EmailService] Email successfully dispatched via Brevo (messageId: ${(data as { messageId?: string }).messageId || 'unknown'})`
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
      `[EmailService] BREVO_API_KEY not configured. Falling back to console dispatch:\nTo: ${toEmail}\nSubject: ${subject}`
    );
  }
}
