import { Router } from 'express';
export const orderRoutes = Router().get('/health', (req, res) => res.json({ message: 'Order module active' }));
