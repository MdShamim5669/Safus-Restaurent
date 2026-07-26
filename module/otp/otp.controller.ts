import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { OtpService } from './otp.service';

export const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await OtpService.resendOtp(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
});

export const OtpController = {
  resendOtp,
};
