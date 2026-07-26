import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { MenuService } from './menu.service';

export const createMenuItem = catchAsync(async (req: Request, res: Response) => {
  const result = await MenuService.createMenuItem(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Menu item created successfully',
    data: result,
  });
});

export const getAllMenuItems = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    category: req.query.category as string | undefined,
    search: req.query.search as string | undefined,
    sortBy: (req.query.sortBy as 'price' | 'createdAt') || 'createdAt',
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
  };

  const result = await MenuService.getAllMenuItems(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Menu items retrieved successfully',
    data: result,
  });
});

export const getSingleMenuItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MenuService.getSingleMenuItem(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Menu item retrieved successfully',
    data: result,
  });
});

export const updateMenuItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MenuService.updateMenuItem(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Menu item updated successfully',
    data: result,
  });
});

export const deleteMenuItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MenuService.deleteMenuItem(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

export const MenuController = {
  createMenuItem,
  getAllMenuItems,
  getSingleMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
