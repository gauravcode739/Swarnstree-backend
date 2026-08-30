import express from 'express';
import { createReview, getReviews, getAllReviews, updateReview, deleteReview } from '../controllers/review.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';
import { upload, processImageAndUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/create', [authJwt.verifyToken, upload.array('images', 5), processImageAndUpload, validationMiddleware(true)], createReview);
router.get('/product/:productId', getReviews);

// Admin routes
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], getAllReviews);
router.route('/:id')
  .put([authJwt.verifyToken, authJwt.isAdmin, upload.array('images', 5), processImageAndUpload], updateReview)
  .delete([authJwt.verifyToken, authJwt.isAdmin], deleteReview);

export default router;
