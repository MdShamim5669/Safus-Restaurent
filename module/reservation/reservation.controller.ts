import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { ReservationService } from './reservation.service';

export const createReservation = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await ReservationService.createReservation(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Table reservation booked successfully',
    data: result,
  });
});

export const getMyReservations = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await ReservationService.getMyReservations(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservations retrieved successfully',
    data: result,
  });
});

export const getAllReservations = catchAsync(async (req: Request, res: Response) => {
  const result = await ReservationService.getAllReservations();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All reservations retrieved successfully',
    data: result,
  });
});

export const cancelReservation = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const { id } = req.params;
  const result = await ReservationService.cancelReservation(userId, role, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

export const ReservationController = {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
};
