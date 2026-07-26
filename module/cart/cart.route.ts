import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { CartController } from './cart.controller';
import { CartValidation } from './cart.validation';

const router = Router();

// All cart routes require user authentication
router.use(authMiddleware());

router.post('/', validateRequest(CartValidation.addToCartSchema), CartController.addToCart);
router.get('/', CartController.getMyCart);
router.patch('/:id', validateRequest(CartValidation.updateCartQuantitySchema), CartController.updateCartItemQuantity);
router.delete('/:id', CartController.removeCartItem);
router.delete('/', CartController.clearMyCart);

export const cartRoutes = router;
