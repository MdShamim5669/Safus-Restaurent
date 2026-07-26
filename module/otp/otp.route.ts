import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { OtpController } from './otp.controller';
import { OtpValidation } from './otp.validation';

const router = Router();

router.post('/resend', validateRequest(OtpValidation.resendOtpSchema), OtpController.resendOtp);

export const otpRoutes = router;
