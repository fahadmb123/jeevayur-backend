import { z } from 'zod';

export const queryYogaSchema = z.object({
  query: z.object({
    day: z.string().optional(),
    format: z.string().optional(),
    level: z.string().optional(),
    search: z.string().optional(),
  }).optional(),
});

export const createYogaSessionSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100),
    duration: z.string().trim().min(2, 'Duration is required'),
    format: z.enum(['online', 'offline']),
    suitableFor: z.string().trim().min(2, 'Target audience is required'),
    days: z.array(z.string()).min(1, 'Select at least one active day'),
    time: z.string().optional().nullable(),
    scheduleItems: z.array(
      z.object({
        day: z.string(),
        time: z.string(),
      })
    ).optional().nullable(),
    description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000),
    level: z.string().optional().nullable(),
    ageGroup: z.string().optional().nullable(),
    instructor: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    capacity: z.number().int().positive().optional().nullable(),
    price: z.string().optional().nullable(),
    priceAmount: z.string().optional().nullable(),
    priceUnit: z.string().optional().nullable(),
    status: z.enum(['active', 'upcoming']).optional().nullable(),
    imageUrl: z.string().optional().nullable(),
  }),
});

export const updateYogaSessionSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(100).optional(),
    duration: z.string().trim().min(2).optional(),
    format: z.enum(['online', 'offline']).optional(),
    suitableFor: z.string().trim().min(2).optional(),
    days: z.array(z.string()).min(1).optional(),
    time: z.string().optional().nullable(),
    scheduleItems: z.array(
      z.object({
        day: z.string(),
        time: z.string(),
      })
    ).optional().nullable(),
    description: z.string().trim().min(10).max(1000).optional(),
    level: z.string().optional().nullable(),
    ageGroup: z.string().optional().nullable(),
    instructor: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    capacity: z.number().int().positive().optional().nullable(),
    price: z.string().optional().nullable(),
    priceAmount: z.string().optional().nullable(),
    priceUnit: z.string().optional().nullable(),
    status: z.enum(['active', 'upcoming']).optional().nullable(),
    imageUrl: z.string().optional().nullable(),
  }),
});
