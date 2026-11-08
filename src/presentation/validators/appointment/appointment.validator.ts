import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    type: z.enum(['ayurveda treatment', 'yoga class']),
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Invalid email address format'),
    reason: z.string().trim().min(5, 'Reason must be at least 5 characters'),
    format: z.enum(['online', 'offline']),
    language: z.string().trim().min(1, 'Language is required'),
  }),
});
