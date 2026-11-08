export type AppointmentType = 'ayurveda treatment' | 'yoga class';
export type AppointmentFormat = 'online' | 'offline';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly type: AppointmentType,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly reason: string,
    public readonly format: AppointmentFormat,
    public readonly language: string,
    public readonly status: AppointmentStatus = 'PENDING',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}
