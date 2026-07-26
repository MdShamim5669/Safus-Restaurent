import prisma from '../../config/db';
import { AppError } from '../utils/AppError';

export const addToCart = async (
  userId: string,
  payload: { menuId: string; quantity: number }
) => {
  const menuItem = await prisma.menu.findUnique({
    where: { id: payload.menuId },
  });

  if (!menuItem) {
    throw new AppError(404, 'Menu item not found');
  }

  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      userId,
      menuId: payload.menuId,
    },
  });

  if (existingCartItem) {
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + payload.quantity,
      },
      include: { menu: true },
    });
    return updatedCartItem;
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      userId,
      menuId: payload.menuId,
      quantity: payload.quantity,
    },
    include: { menu: true },
  });

  return cartItem;
};

export const getMyCart = async (userId: string) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { menu: true },
    orderBy: { id: 'asc' },
  });

  const totalAmount = cartItems.reduce(
    (sum: number, item: { menu: { price: number }; quantity: number }) =>
      sum + item.menu.price * item.quantity,
    0
  );

  return {
    cartItems,
    totalItems: cartItems.length,
    totalAmount: Number(totalAmount.toFixed(2)),
  };
};

export const updateCartItemQuantity = async (
  userId: string,
  cartItemId: string,
  quantity: number
) => {
  const existingItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
  });

  if (!existingItem) {
    throw new AppError(404, 'Cart item not found in your cart');
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    return { message: 'Cart item removed' };
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { menu: true },
  });

  return updatedItem;
};

export const removeCartItem = async (userId: string, cartItemId: string) => {
  const existingItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
  });

  if (!existingItem) {
    throw new AppError(404, 'Cart item not found in your cart');
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return { message: 'Cart item removed successfully' };
};

export const clearMyCart = async (userId: string) => {
  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return { message: 'Cart cleared successfully' };
};

export const CartService = {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeCartItem,
  clearMyCart,
};
