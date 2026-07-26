import prisma from '../../config/db';
import { AppError } from '../utils/AppError';
import { OrderStatus } from '../shared';

export const createOrder = async (
  userId: string,
  payload: { items?: Array<{ menuId: string; quantity: number }> }
) => {
  let orderItemsToCreate: Array<{ menuId: string; quantity: number; price: number }> = [];
  let total = 0;

  if (payload.items && payload.items.length > 0) {
    for (const item of payload.items) {
      const menuItem = await prisma.menu.findUnique({
        where: { id: item.menuId },
      });
      if (!menuItem) {
        throw new AppError(404, `Menu item with ID ${item.menuId} not found`);
      }
      orderItemsToCreate.push({
        menuId: item.menuId,
        quantity: item.quantity,
        price: menuItem.price,
      });
      total += menuItem.price * item.quantity;
    }
  } else {
    // Populate order from user's current cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { menu: true },
    });

    if (cartItems.length === 0) {
      throw new AppError(400, 'Your cart is empty');
    }

    for (const item of cartItems) {
      orderItemsToCreate.push({
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.menu.price,
      });
      total += item.menu.price * item.quantity;
    }
  }

  // Create Order and clear cart atomically in a Prisma Transaction
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        total: Number(total.toFixed(2)),
        items: {
          create: orderItemsToCreate,
        },
      },
      include: {
        items: {
          include: { menu: true },
        },
        payment: true,
      },
    });

    // Clear cart if created from cart
    if (!payload.items || payload.items.length === 0) {
      await tx.cartItem.deleteMany({
        where: { userId },
      });
    }

    return createdOrder;
  });

  return order;
};

export const getMyOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { menu: true },
      },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

export const getSingleOrder = async (userId: string, role: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: { id: true, name: true, email: true, photoUrl: true },
      },
      items: {
        include: { menu: true },
      },
      payment: true,
    },
  });

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  if (role !== 'ADMIN' && order.userId !== userId) {
    throw new AppError(403, 'Forbidden access to this order');
  }

  return order;
};

export const getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: { menu: true },
      },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!existingOrder) {
    throw new AppError(404, 'Order not found');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: { menu: true },
      },
      payment: true,
    },
  });

  return updatedOrder;
};

export const cancelOrder = async (userId: string, role: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  if (role !== 'ADMIN' && order.userId !== userId) {
    throw new AppError(403, 'Forbidden access to cancel this order');
  }

  if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
    throw new AppError(400, `Cannot cancel order with status ${order.status}`);
  }

  const cancelledOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
  });

  return cancelledOrder;
};

export const OrderService = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
