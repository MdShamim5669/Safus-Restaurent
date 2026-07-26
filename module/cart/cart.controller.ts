import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { CartService } from './cart.service';

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await CartService.addToCart(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Item added to cart successfully',
    data: result,
  });
});

export const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await CartService.getMyCart(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart retrieved successfully',
    data: result,
  });
});

export const updateCartItemQuantity = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { quantity } = req.body;
  const result = await CartService.updateCartItemQuantity(userId, id, quantity);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart item quantity updated',
    data: result,
  });
});

export const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const result = await CartService.removeCartItem(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

export const clearMyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await CartService.clearMyCart(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

export const CartController = {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeCartItem,
  clearMyCart,
};
