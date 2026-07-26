import { Router } from 'express';
export const reviewRoutes = Router().get('/health', (req, res) => res.json({ message: 'Review module active' }));
