import { z } from 'zod';

export const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    recipe: z.string().min(5, 'Recipe details must be at least 5 characters'),
    category: z.string().min(2, 'Category is required'),
    price: z.number().positive('Price must be a positive number'),
    imageUrl: z.string().url('Image URL must be a valid URL'),
    videoUrl: z.string().url('Video URL must be a valid URL').optional(),
  }),
});

export const updateMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    recipe: z.string().min(5).optional(),
    category: z.string().min(2).optional(),
    price: z.number().positive().optional(),
    imageUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
  }),
});

export const MenuValidation = {
  createMenuSchema,
  updateMenuSchema,
};
