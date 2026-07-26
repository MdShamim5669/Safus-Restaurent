import prisma from '../../config/db';
import { AppError } from '../utils/AppError';

export const createReview = async (
  userId: string,
  payload: { rating: number; details: string }
) => {
  const review = await prisma.review.create({
    data: {
      userId,
      rating: payload.rating,
      details: payload.details,
    },
    include: {
      user: {
        select: { id: true, name: true, photoUrl: true },
      },
    },
  });

  return review;
};

export const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: { id: true, name: true, photoUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

  return {
    reviews,
    totalReviews,
    averageRating,
  };
};

export const deleteReview = async (userId: string, role: string, id: string) => {
  const existing = await prisma.review.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError(404, 'Review not found');
  }

  if (role !== 'ADMIN' && existing.userId !== userId) {
    throw new AppError(403, 'Forbidden access to delete this review');
  }

  await prisma.review.delete({
    where: { id },
  });

  return { message: 'Review deleted successfully' };
};

export const ReviewService = {
  createReview,
  getAllReviews,
  deleteReview,
};
