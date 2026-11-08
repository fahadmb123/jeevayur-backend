export interface NewLoginAlertParams {
  toEmail: string;
  recipientName: string;
  device: string;
  ipAddress: string;
  city?: string | null;
  country?: string | null;
  loginTime: Date;
  manageSessionsUrl: string;
}

export interface AppointmentNotificationParams {
  toEmail: string;
  type: string;
  name: string;
  email: string;
  reason: string;
  format: string;
  language: string;
  createdAt: Date;
}

export interface IEmailService {
  sendPasswordResetEmail(toEmail: string, resetUrl: string, recipientName?: string): Promise<void>;
  sendNewLoginAlertEmail(params: NewLoginAlertParams): Promise<void>;
  sendAppointmentNotificationEmail(params: AppointmentNotificationParams): Promise<void>;
}
