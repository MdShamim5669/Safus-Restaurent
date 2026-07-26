import { Router } from 'express';
export const reservationRoutes = Router().get('/health', (req, res) => res.json({ message: 'Reservation module active' }));
