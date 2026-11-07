export type ApplicationErrorKind =
  | 'VALIDATION'
  | 'AUTHENTICATION'
  | 'AUTHORIZATION'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL';

export class ApplicationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly kind: ApplicationErrorKind = 'INTERNAL',
    public readonly errors: unknown = null
  ) {
    super(message);
    this.name = 'ApplicationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
