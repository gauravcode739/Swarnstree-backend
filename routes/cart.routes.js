import express from 'express';
import { addToCart, getCart } from '../controllers/cart.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/add', [authJwt.verifyToken, validationMiddleware(true)], addToCart);
router.get('/', [authJwt.verifyToken], getCart);

export default router;
