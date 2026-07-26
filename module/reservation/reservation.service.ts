import prisma from '../../config/db';
import { AppError } from '../utils/AppError';

export const createReservation = async (
  userId: string,
  payload: { date: string; time: string; guests: number; note?: string }
) => {
  const reservationDate = new Date(payload.date);
  if (reservationDate < new Date()) {
    throw new AppError(400, 'Reservation date must be in the future');
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId,
      date: reservationDate,
      time: payload.time,
      guests: payload.guests,
      note: payload.note,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return reservation;
};

export const getMyReservations = async (userId: string) => {
  const reservations = await prisma.reservation.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });

  return reservations;
};

export const getAllReservations = async () => {
  const reservations = await prisma.reservation.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { date: 'asc' },
  });

  return reservations;
};

export const cancelReservation = async (userId: string, role: string, id: string) => {
  const existing = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError(404, 'Reservation not found');
  }

  if (role !== 'ADMIN' && existing.userId !== userId) {
    throw new AppError(403, 'Forbidden access to this reservation');
  }

  await prisma.reservation.delete({
    where: { id },
  });

  return { message: 'Reservation cancelled successfully' };
};

export const ReservationService = {
  createReservation,
  getMyReservations,
  getAllReservations,
  cancelReservation,
};
