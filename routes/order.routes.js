import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, sendOrderEmailManual } from '../controllers/order.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

// Order creation supports guest (no token required strictly, but can pass token)
router.post('/create', validationMiddleware(true), createOrder);

// Only admins can get all orders
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], getOrders);
router.get('/:id', [authJwt.verifyToken, authJwt.isAdmin], getOrderById);
router.put('/:id/status', [authJwt.verifyToken, authJwt.isAdmin], updateOrderStatus);
router.post('/:id/email', [authJwt.verifyToken, authJwt.isAdmin], sendOrderEmailManual);

export default router;
