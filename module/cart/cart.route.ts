import { Router } from 'express';
export const cartRoutes = Router().get('/health', (req, res) => res.json({ message: 'Cart module active' }));
