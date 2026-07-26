import { z } from 'zod';
import { OrderStatus } from '../shared';

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          menuId: z.string().uuid('Invalid menu item ID'),
          quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        })
      )
      .min(1, 'Order must contain at least 1 item')
      .optional(), // If omitted, creates order from user's current cart
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus, {
      errorMap: () => ({ message: 'Invalid order status' }),
    }),
  }),
});

export const OrderValidation = {
  createOrderSchema,
  updateOrderStatusSchema,
};
