import { z } from 'zod';

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, 'Refresh token cannot be empty').optional(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
