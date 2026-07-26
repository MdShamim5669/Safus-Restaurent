import { Router } from 'express';
export const menuRoutes = Router().get('/health', (req, res) => res.json({ message: 'Menu module active' }));
