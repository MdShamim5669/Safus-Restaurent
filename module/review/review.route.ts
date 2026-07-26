import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = Router();

// Public route to view all reviews
router.get('/', ReviewController.getAllReviews);

// Protected routes to post and delete reviews
router.post(
  '/',
  authMiddleware(),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReview
);

router.delete('/:id', authMiddleware(), ReviewController.deleteReview);

export const reviewRoutes = router;
