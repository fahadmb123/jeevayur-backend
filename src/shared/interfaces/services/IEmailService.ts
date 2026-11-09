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
  phone: string;
  reason: string;
  format: string;
  language: string;
  createdAt: Date;
}

export interface AppointmentAcceptedParams {
  toEmail: string;
  recipientName: string;
  type: string;
  format: string;
  language: string;
  reason: string;
}

export interface AppointmentRejectedParams {
  toEmail: string;
  recipientName: string;
  type: string;
  reason?: string;
}

export interface AppointmentReceivedParams {
  toEmail: string;
  recipientName: string;
  type: string;
  phone: string;
  format: string;
  language: string;
  reason: string;
}

export interface IEmailService {
  sendPasswordResetEmail(toEmail: string, resetUrl: string, recipientName?: string): Promise<void>;
  sendNewLoginAlertEmail(params: NewLoginAlertParams): Promise<void>;
  sendAppointmentNotificationEmail(params: AppointmentNotificationParams): Promise<void>;
  sendAppointmentReceivedEmail(params: AppointmentReceivedParams): Promise<void>;
  sendAppointmentAcceptedEmail(params: AppointmentAcceptedParams): Promise<void>;
  sendAppointmentRejectedEmail(params: AppointmentRejectedParams): Promise<void>;
}
