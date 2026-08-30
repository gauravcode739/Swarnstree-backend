import express from 'express';
import { createCoupon, getCoupons } from '../controllers/coupon.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/create', [authJwt.verifyToken, authJwt.isAdmin, validationMiddleware(true)], createCoupon);
router.get('/', getCoupons);

export default router;
