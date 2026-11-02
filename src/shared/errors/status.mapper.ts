export const StatusMessage = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  CONFLICT: 'Conflict',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
} as const;

export type StatusMessageType = (typeof StatusMessage)[keyof typeof StatusMessage];

export const statusMapper: Record<string, number> = {
  [StatusMessage.BAD_REQUEST]: 400,
  [StatusMessage.UNAUTHORIZED]: 401,
  [StatusMessage.FORBIDDEN]: 403,
  [StatusMessage.NOT_FOUND]: 404,
  [StatusMessage.CONFLICT]: 409,
  [StatusMessage.UNPROCESSABLE_ENTITY]: 422,
  [StatusMessage.INTERNAL_SERVER_ERROR]: 500,

  'Invalid email or password': 401,
  'Authentication required': 401,
  'Invalid or expired token': 401,
  'Invalid or expired access token': 401,
  'Invalid or expired refresh token': 401,
  'Refresh token required': 401,
  'User no longer exists': 401,
  'Access forbidden': 403,
  'Request validation failed': 400,
  'Invalid input': 400,
  'User not found': 404,
  'Resource not found': 404,
  'Email already registered': 409,
  'User already exists': 409,
};

export function getStatusCodeFromMessage(message?: string): number {
  if (!message) return 500;
  if (statusMapper[message] !== undefined) {
    return statusMapper[message];
  }

  const lower = message.toLowerCase();
  if (
    lower.includes('unauthorized') ||
    lower.includes('authentication required') ||
    lower.includes('invalid email or password') ||
    lower.includes('invalid credentials') ||
    lower.includes('expired token') ||
    lower.includes('invalid token') ||
    lower.includes('refresh token required') ||
    lower.includes('no longer exists')
  ) {
    return 401;
  }

  if (
    lower.includes('forbidden') ||
    lower.includes('access forbidden') ||
    lower.includes('access denied') ||
    lower.includes('insufficient permission')
  ) {
    return 403;
  }

  if (lower.includes('not found') || lower.includes('does not exist')) {
    return 404;
  }

  if (lower.includes('already exists') || lower.includes('conflict') || lower.includes('already registered')) {
    return 409;
  }

  if (lower.includes('validation failed') || lower.includes('invalid input') || lower.includes('bad request') || lower.includes('required')) {
    return 400;
  }

  return 500;
}
