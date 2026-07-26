import prisma from '../../config/db';
import { AppError } from '../utils/AppError';
import { generateOtp } from '../utils/generateOtp';
import { sendEmail } from '../utils/sendEmail';

export const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(404, 'User not found with this email');
  }

  // Delete previous active OTPs for this user
  await prisma.otp.deleteMany({
    where: { userId: user.id },
  });

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
    subject: 'SaFus Restaurant — Resent OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Verification OTP Code</h2>
        <p>Your new verification OTP code is:</p>
        <h1 style="color: #e53935; letter-spacing: 4px;">${otpCode}</h1>
        <p>Valid for 5 minutes.</p>
      </div>
    `,
  });

  return { message: 'New OTP sent to your email' };
};

export const OtpService = {
  resendOtp,
};
