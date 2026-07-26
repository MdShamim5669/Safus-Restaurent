import { z } from 'zod';
import { PaymentGateway } from '../shared';

export const createPaymentIntentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid('Invalid order ID'),
    gateway: z.nativeEnum(PaymentGateway, {
      errorMap: () => ({ message: 'Gateway must be STRIPE or SSLCOMMERZ' }),
    }),
  }),
});

export const PaymentValidation = {
  createPaymentIntentSchema,
};
