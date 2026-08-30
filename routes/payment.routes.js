import express from 'express';
import { createPayment, getPayments, generatePayUHash, payuSuccess, payuFailure } from '../controllers/payment.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/create', [authJwt.verifyToken, validationMiddleware(true)], createPayment);
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], getPayments);

// PayU Routes
router.post('/payu/hash', generatePayUHash);
router.post('/payu/success', payuSuccess);
router.post('/payu/failure', payuFailure);

export default router;
