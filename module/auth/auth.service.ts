import bcrypt from 'bcrypt';
import prisma from '../../config/db';
import env from '../../config/env';
import { AppError } from '../utils/AppError';
import { generateOtp } from '../utils/generateOtp';
import { createToken, verifyToken } from '../utils/jwtHelpers';
import { sendEmail } from '../utils/sendEmail';

const SALT_ROUNDS = 10;

export const registerUser = async (payload: { name: string; email: string; password: string }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(400, 'User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      isVerified: false,
    },
  });

  // Generate 6-digit OTP valid for 5 minutes
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.create({
    data: {
      userId: user.id,
      code: otpCode,
      expiresAt,
    },
  });

  // Send verification OTP via Resend
  await sendEmail({
    to: user.email,
    subject: 'SaFus Restaurant — Verify Your Email OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to SaFus Restaurant, ${user.name}! 🍳</h2>
        <p>Your verification OTP code is:</p>
        <h1 style="color: #e53935; letter-spacing: 4px;">${otpCode}</h1>
        <p>This code is valid for 5 minutes.</p>
      </div>
    `,
  });

  return {
    userId: user.id,
    email: user.email,
    message: 'Registration successful! Verification OTP sent to your email.',
  };
};

export const verifyOtp = async (payload: { email: string; code: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const validOtp = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      code: payload.code,
      expiresAt: { gt: new Date() },
    },
  });

  if (!validOtp) {
    throw new AppError(400, 'Invalid or expired OTP code');
  }

  // Update user as verified and cleanup OTPs for this user
  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });

  await prisma.otp.deleteMany({
    where: { userId: user.id },
  });

  // Generate tokens
  const jwtPayload = { id: user.id, email: user.email, role: user.role };

  const accessToken = createToken(jwtPayload, env.JWT_ACCESS_SECRET, '1d');
  const refreshToken = createToken(jwtPayload, env.JWT_REFRESH_SECRET, '7d');

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: true,
      photoUrl: user.photoUrl,
    },
  };
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(401, 'Invalid email or password');
  }

  if (!user.isVerified) {
    throw new AppError(403, 'Account is not verified yet. Please verify your OTP.');
  }

  const jwtPayload = { id: user.id, email: user.email, role: user.role };

  const accessToken = createToken(jwtPayload, env.JWT_ACCESS_SECRET, '1d');
  const refreshToken = createToken(jwtPayload, env.JWT_REFRESH_SECRET, '7d');

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      photoUrl: user.photoUrl,
    },
  };
};

export const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(401, 'Refresh token is required');
  }

  const decoded = verifyToken(token, env.JWT_REFRESH_SECRET) as any;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const jwtPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, env.JWT_ACCESS_SECRET, '1d');

  return {
    accessToken,
  };
};

export const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(404, 'User not found with this email');
  }

  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.create({
    data: {
      userId: user.id,
      code: otpCode,
      expiresAt,
    },
  });

  await sendEmail({
    to: user.email,
    subject: 'SaFus Restaurant — Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Use the following OTP code to reset your password:</p>
        <h1 style="color: #e53935; letter-spacing: 4px;">${otpCode}</h1>
        <p>Valid for 5 minutes.</p>
      </div>
    `,
  });

  return {
    message: 'Password reset OTP sent to your email.',
  };
};

export const resetPassword = async (payload: {
  email: string;
  code: string;
  newPassword: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const validOtp = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      code: payload.code,
      expiresAt: { gt: new Date() },
    },
  });

  if (!validOtp) {
    throw new AppError(400, 'Invalid or expired OTP code');
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await prisma.otp.deleteMany({
    where: { userId: user.id },
  });

  return {
    message: 'Password reset successfully. You can now login with your new password.',
  };
};

export const AuthService = {
  registerUser,
  verifyOtp,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};
