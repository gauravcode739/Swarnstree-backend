import express from 'express';
import { login, getDashboardStats } from '../controllers/admin.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/login', validationMiddleware(true), login);
router.get('/stats', [authJwt.verifyToken, authJwt.isAdmin], getDashboardStats);

export default router;
