import prisma from '../../config/db';
import { AppError } from '../utils/AppError';
import { Role } from '../shared';

export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      photoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User profile not found');
  }

  return user;
};

export const updateMyProfile = async (
  userId: string,
  payload: { name?: string; photoUrl?: string }
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      photoUrl: true,
      updatedAt: true,
    },
  });

  return user;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      photoUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
};

export const updateUserRole = async (targetUserId: string, role: Role) => {
  const user = await prisma.user.update({
    where: { id: targetUserId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const UserService = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserRole,
};
