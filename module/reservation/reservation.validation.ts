import { z } from 'zod';

export const createReservationSchema = z.object({
  body: z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    time: z.string().min(1, 'Time is required (e.g. 19:00)'),
    guests: z.number().int().min(1, 'Guests must be at least 1'),
    note: z.string().optional(),
  }),
});

export const ReservationValidation = {
  createReservationSchema,
};
