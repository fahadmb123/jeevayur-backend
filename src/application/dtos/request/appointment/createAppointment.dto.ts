export interface CreateAppointmentRequestDto {
  type: 'ayurveda treatment' | 'yoga class';
  name: string;
  email: string;
  reason: string;
  format: 'online' | 'offline';
  language: string;
}
