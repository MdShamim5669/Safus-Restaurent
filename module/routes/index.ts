import { Router } from 'express';
import { authRoutes } from '../auth/auth.route';
import { cartRoutes } from '../cart/cart.route';
import { menuRoutes } from '../menu/menu.route';
import { orderRoutes } from '../order/order.route';
import { otpRoutes } from '../otp/otp.route';
import { paymentRoutes } from '../payment/payment.route';
import { reservationRoutes } from '../reservation/reservation.route';
import { reviewRoutes } from '../review/review.route';
import { userRoutes } from '../user/user.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/menu', route: menuRoutes },
  { path: '/cart', route: cartRoutes },
  { path: '/orders', route: orderRoutes },
  { path: '/reservations', route: reservationRoutes },
  { path: '/reviews', route: reviewRoutes },
  { path: '/payment', route: paymentRoutes },
  { path: '/otp', route: otpRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
