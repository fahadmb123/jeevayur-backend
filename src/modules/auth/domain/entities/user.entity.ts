export type UserRole = 'patient' | 'doctor' | 'admin';

export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly createdAt: Date
  ) {}
}

