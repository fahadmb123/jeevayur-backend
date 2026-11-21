import { z } from 'zod';

export const createGalleryItemSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(150, 'Title cannot exceed 150 characters'),
    category: z.enum(['yoga', 'treatment'] as const),
    description: z
      .string()
      .trim()
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional()
      .nullable(),
    author: z
      .string()
      .trim()
      .max(100, 'Author cannot exceed 100 characters')
      .optional()
      .nullable(),
    aspectRatio: z
      .enum(['landscape', 'portrait', 'square'] as const)
      .optional()
      .default('landscape'),
    imageUrl: z.string().trim().optional(),
  }),
});

export const queryGallerySchema = z.object({
  query: z.object({
    category: z.enum(['all', 'yoga', 'treatment'] as const).optional(),
    search: z.string().trim().max(100).optional(),
  }).optional(),
});
