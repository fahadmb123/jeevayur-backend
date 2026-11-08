export interface CreateAppointmentRequestDto {
  type: 'ayurveda treatment' | 'yoga class';
  name: string;
  email: string;
  phone: string;
  reason: string;
  format: 'online' | 'offline';
  language: string;
}
