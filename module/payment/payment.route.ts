import { Router } from 'express';
export const paymentRoutes = Router().get('/health', (req, res) => res.json({ message: 'Payment module active' }));
