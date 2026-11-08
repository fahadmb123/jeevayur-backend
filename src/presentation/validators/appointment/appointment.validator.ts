import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    type: z.enum(['ayurveda treatment', 'yoga class']),
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Invalid email address format'),
    phone: z.string().trim().min(6, 'Phone number must have at least 6 digits'),
    reason: z.string().trim().min(5, 'Reason must be at least 5 characters'),
    format: z.enum(['online', 'offline']),
    language: z.string().trim().min(1, 'Language is required'),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, 'Appointment ID is required'),
  }),
  body: z.object({
    status: z.enum([
      'PENDING',
      'CONFIRMED',
      'CANCELLED',
      'pending',
      'confirmed',
      'cancelled',
      'accepted',
      'rejected',
    ]),
    reason: z.string().trim().optional(),
  }),
});
