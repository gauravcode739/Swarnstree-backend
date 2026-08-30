import express from 'express';
import { toggleWishlist, getWishlist } from '../controllers/wishlist.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/toggle', [authJwt.verifyToken, validationMiddleware(true)], toggleWishlist);
router.get('/', [authJwt.verifyToken], getWishlist);

export default router;
