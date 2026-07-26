import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { Role } from '../shared';
import { MenuController } from './menu.controller';
import { MenuValidation } from './menu.validation';

const router = Router();

// Public routes
router.get('/', MenuController.getAllMenuItems);
router.get('/:id', MenuController.getSingleMenuItem);

// Admin-only routes
router.post(
  '/',
  authMiddleware(Role.ADMIN),
  validateRequest(MenuValidation.createMenuSchema),
  MenuController.createMenuItem
);

router.patch(
  '/:id',
  authMiddleware(Role.ADMIN),
  validateRequest(MenuValidation.updateMenuSchema),
  MenuController.updateMenuItem
);

router.delete('/:id', authMiddleware(Role.ADMIN), MenuController.deleteMenuItem);

export const menuRoutes = router;
