import express from 'express';
import { createBanner, getBanners } from '../controllers/banner.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/create', [authJwt.verifyToken, authJwt.isAdmin, validationMiddleware(true)], createBanner);
router.get('/', getBanners);

export default router;
