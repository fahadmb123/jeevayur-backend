export class Customer {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly phone?: string
  ) {}
}

