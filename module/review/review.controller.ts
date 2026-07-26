import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { ReviewService } from './review.service';

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await ReviewService.createReview(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviews();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const { id } = req.params;
  const result = await ReviewService.deleteReview(userId, role, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  deleteReview,
};
