import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, 'Rating must be 1 to 5').max(5, 'Rating must be 1 to 5'),
    details: z.string().min(3, 'Review comment must be at least 3 characters'),
  }),
});

export const ReviewValidation = {
  createReviewSchema,
};
