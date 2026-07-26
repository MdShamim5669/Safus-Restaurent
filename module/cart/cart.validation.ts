import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    menuId: z.string().uuid('Invalid menu item ID'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
  }),
});

export const updateCartQuantitySchema = z.object({
  body: z.object({
    quantity: z.number().int('Quantity must be an integer'),
  }),
});

export const CartValidation = {
  addToCartSchema,
  updateCartQuantitySchema,
};
