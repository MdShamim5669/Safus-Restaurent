import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { Role } from '../shared';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

router.get('/me', authMiddleware(), UserController.getMyProfile);

router.patch(
  '/me',
  authMiddleware(),
  validateRequest(UserValidation.updateProfileSchema),
  UserController.updateMyProfile
);

router.get('/', authMiddleware(Role.ADMIN), UserController.getAllUsers);

router.patch(
  '/:id/role',
  authMiddleware(Role.ADMIN),
  validateRequest(UserValidation.updateUserRoleSchema),
  UserController.updateUserRole
);

export const userRoutes = router;
