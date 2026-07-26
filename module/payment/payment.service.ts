import prisma from '../../config/db';
import stripe from '../../config/stripe';
import { AppError } from '../utils/AppError';
import { OrderStatus, PaymentGateway, PaymentStatus } from '../shared';

export const createPaymentIntent = async (
  userId: string,
  payload: { orderId: string; gateway: PaymentGateway }
) => {
  const order = await prisma.order.findUnique({
    where: { id: payload.orderId },
    include: { payment: true },
  });

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  if (order.userId !== userId) {
    throw new AppError(403, 'Forbidden access to this order');
  }

  if (order.status === OrderStatus.PAID) {
    throw new AppError(400, 'Order is already paid');
  }

  if (payload.gateway === PaymentGateway.STRIPE) {
    // Stripe PaymentIntent creation (amount in cents)
    const amountInCents = Math.round(order.total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId,
      },
    });

    // Upsert Payment record linked to Order
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        gateway: PaymentGateway.STRIPE,
        amount: order.total,
        status: PaymentStatus.PENDING,
        txnId: paymentIntent.id,
      },
      update: {
        gateway: PaymentGateway.STRIPE,
        amount: order.total,
        txnId: paymentIntent.id,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.total,
    };
  }

  if (payload.gateway === PaymentGateway.SSLCOMMERZ) {
    const txnId = `SSLCZ_TXN_${Date.now()}`;

    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        gateway: PaymentGateway.SSLCOMMERZ,
        amount: order.total,
        status: PaymentStatus.PENDING,
        txnId,
      },
      update: {
        gateway: PaymentGateway.SSLCOMMERZ,
        amount: order.total,
        txnId,
      },
    });

    return {
      txnId,
      amount: order.total,
      gatewayUrl: `https://sandbox.sslcommerz.com/gwprocess/v4/api.php?txnId=${txnId}`,
    };
  }

  throw new AppError(400, 'Unsupported payment gateway');
};

export const handlePaymentSuccess = async (orderId: string, txnId: string) => {
  // Execute atomic Prisma transaction to update both Payment and Order
  return await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { orderId },
      data: {
        status: PaymentStatus.SUCCESS,
        txnId,
      },
    });

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
      },
    });

    return { updatedPayment, updatedOrder };
  });
};

export const handlePaymentFailure = async (orderId: string) => {
  return await prisma.payment.update({
    where: { orderId },
    data: {
      status: PaymentStatus.FAILED,
    },
  });
};

export const PaymentService = {
  createPaymentIntent,
  handlePaymentSuccess,
  handlePaymentFailure,
};
