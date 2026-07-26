import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { OrderService } from './order.service';

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await OrderService.createOrder(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await OrderService.getMyOrders(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

export const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const { id } = req.params;
  const result = await OrderService.getSingleOrder(userId, role, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order details retrieved successfully',
    data: result,
  });
});

export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrders();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders retrieved successfully',
    data: result,
  });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await OrderService.updateOrderStatus(id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const { id } = req.params;
  const result = await OrderService.cancelOrder(userId, role, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order cancelled successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
