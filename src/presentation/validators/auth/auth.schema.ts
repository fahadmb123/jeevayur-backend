import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
    email: z.string().trim().email('Invalid email address').optional(),
    phone: z
      .string()
      .trim()
      .nullable()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const digits = val.replace(/[\s\-\+\(\)]/g, '');
        return digits.length >= 6 && digits.length <= 15;
      }, 'Phone number must have between 6 and 15 digits'),
  }),
});
