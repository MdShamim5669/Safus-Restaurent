import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = Router();

router.post(
  '/intent',
  authMiddleware(),
  validateRequest(PaymentValidation.createPaymentIntentSchema),
  PaymentController.createPaymentIntent
);

router.post('/webhook/stripe', PaymentController.stripeWebhook);
router.post('/sslcommerz/success', PaymentController.sslCommerzSuccess);
router.post('/sslcommerz/fail', PaymentController.sslCommerzFail);

export const paymentRoutes = router;
