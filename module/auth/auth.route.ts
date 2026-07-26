import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerSchema),
  AuthController.registerUser
);

router.post(
  '/verify-otp',
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthController.verifyOtp
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginSchema),
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenSchema),
  AuthController.refreshToken
);

router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);

export const authRoutes = router;
