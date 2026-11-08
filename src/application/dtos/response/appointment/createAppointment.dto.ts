export interface CreateAppointmentResponseDto {
  id: string;
  type: string;
  name: string;
  email: string;
  reason: string;
  format: string;
  language: string;
  status: string;
  createdAt: string;
}
