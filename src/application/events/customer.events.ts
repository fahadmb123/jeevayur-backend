import type { IDomainEvent } from './user.events.js';

export class CustomerCreatedEvent implements IDomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'CustomerCreated';

  constructor(
    public readonly customerId: number,
    public readonly email: string,
    public readonly name: string
  ) {}
}

