import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { PaymentService } from './payment.service';

export const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await PaymentService.createPaymentIntent(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});

export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const event = req.body;

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await PaymentService.handlePaymentSuccess(orderId, paymentIntent.id);
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      await PaymentService.handlePaymentFailure(orderId);
    }
  }

  res.status(200).json({ received: true });
});

export const sslCommerzSuccess = catchAsync(async (req: Request, res: Response) => {
  const { tran_id, value_a: orderId } = req.body;
  if (orderId) {
    await PaymentService.handlePaymentSuccess(orderId, tran_id);
  }
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success`);
});

export const sslCommerzFail = catchAsync(async (req: Request, res: Response) => {
  const { value_a: orderId } = req.body;
  if (orderId) {
    await PaymentService.handlePaymentFailure(orderId);
  }
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/fail`);
});

export const PaymentController = {
  createPaymentIntent,
  stripeWebhook,
  sslCommerzSuccess,
  sslCommerzFail,
};
