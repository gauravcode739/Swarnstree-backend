import express from 'express';
import { createReview, getReviews, getAllReviews, updateReview, deleteReview } from '../controllers/review.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/create', [authJwt.verifyToken, validationMiddleware(true)], createReview);
router.get('/product/:productId', getReviews);

// Admin routes
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], getAllReviews);
router.route('/:id')
  .put([authJwt.verifyToken, authJwt.isAdmin], updateReview)
  .delete([authJwt.verifyToken, authJwt.isAdmin], deleteReview);

export default router;
