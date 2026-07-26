import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { Role } from '../shared';
import { ReservationController } from './reservation.controller';
import { ReservationValidation } from './reservation.validation';

const router = Router();

router.use(authMiddleware());

router.post(
  '/',
  validateRequest(ReservationValidation.createReservationSchema),
  ReservationController.createReservation
);

router.get('/my-reservations', ReservationController.getMyReservations);
router.get('/all-reservations', authMiddleware(Role.ADMIN), ReservationController.getAllReservations);
router.delete('/:id', ReservationController.cancelReservation);

export const reservationRoutes = router;
