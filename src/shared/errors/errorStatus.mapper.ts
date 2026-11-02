export class ErrorStatusMapper {
  private static readonly exactMatches: Record<string, number> = {
    'Invalid email or password': 401,
    'Invalid credentials': 401,
    'Authentication required': 401,
    'Invalid or expired token': 401,
    'Invalid or expired access token': 401,
    'Invalid or expired refresh token': 401,
    'Refresh token required': 401,
    'User no longer exists': 401,
    'Token is not a refresh token': 401,
    'Unauthorized': 401,
    'Access forbidden': 403,
    'Forbidden': 403,
    'Insufficient permissions': 403,
    'User not found': 404,
    'Resource not found': 404,
    'Not found': 404,
    'Request validation failed': 400,
    'Invalid input': 400,
    'Bad request': 400,
    'User already exists': 409,
    'Email already registered': 409,
    'Conflict': 409,
  };

  public static toStatusCode(message?: string): number {
    if (!message) return 500;

    const trimmed = message.trim();
    if (this.exactMatches[trimmed] !== undefined) {
      return this.exactMatches[trimmed];
    }

    const lower = trimmed.toLowerCase();

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

    if (
      lower.includes('not found') ||
      lower.includes('does not exist')
    ) {
      return 404;
    }

    if (
      lower.includes('already exists') ||
      lower.includes('conflict') ||
      lower.includes('already registered')
    ) {
      return 409;
    }

    if (
      lower.includes('validation failed') ||
      lower.includes('invalid input') ||
      lower.includes('bad request') ||
      lower.includes('required')
    ) {
      return 400;
    }

    return 500;
  }
}
