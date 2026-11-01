export interface IDomainEvent {
  occurredOn: Date;
  eventName: string;
}

export class UserLoggedInEvent implements IDomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'UserLoggedIn';

  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly role: string
  ) {}
}

export class UserLoggedOutEvent implements IDomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'UserLoggedOut';

  constructor(public readonly userId?: number) {}
}
