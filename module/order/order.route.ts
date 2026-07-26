import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { Role } from '../shared';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = Router();

router.use(authMiddleware());

router.post('/', validateRequest(OrderValidation.createOrderSchema), OrderController.createOrder);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/all-orders', authMiddleware(Role.ADMIN), OrderController.getAllOrders);
router.get('/:id', OrderController.getSingleOrder);
router.patch(
  '/:id/status',
  authMiddleware(Role.ADMIN),
  validateRequest(OrderValidation.updateOrderStatusSchema),
  OrderController.updateOrderStatus
);
router.patch('/:id/cancel', OrderController.cancelOrder);

export const orderRoutes = router;
