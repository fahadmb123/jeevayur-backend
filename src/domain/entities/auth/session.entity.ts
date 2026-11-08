export class Session {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public readonly tokenHash: string,
    public readonly ipAddress: string,
    public readonly city: string | null,
    public readonly country: string | null,
    public readonly device: string | null,
    public readonly lastActiveAt: Date,
    public readonly createdAt: Date
  ) {}
}
