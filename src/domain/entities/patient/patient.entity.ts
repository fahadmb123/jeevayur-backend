export class Patient {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly gender: string | null,
    public readonly age: number | null,
    public readonly condition: string | null,
    public readonly status: string,
    public readonly lastVisit: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

