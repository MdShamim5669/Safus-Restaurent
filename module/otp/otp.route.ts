import { Router } from 'express';
export const otpRoutes = Router().get('/health', (req, res) => res.json({ message: 'Otp module active' }));
