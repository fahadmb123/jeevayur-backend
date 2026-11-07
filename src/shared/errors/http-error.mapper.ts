import type { ApplicationErrorKind } from './applicationError.js';

export const HttpErrorMapper: Record<ApplicationErrorKind, number> = {
  VALIDATION: 400,
  AUTHENTICATION: 401,
  AUTHORIZATION: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
};

export function mapKindToHttpStatus(kind: ApplicationErrorKind): number {
  return HttpErrorMapper[kind] ?? 500;
}
