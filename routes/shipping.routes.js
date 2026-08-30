import express from 'express';
import { getSettings, updateSettings, getStates, updateStateConfig, calculateShipping } from '../controllers/shipping.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/calculate', calculateShipping);

router.get('/settings', getSettings);
router.put('/settings', [authJwt.verifyToken, authJwt.isAdmin], updateSettings);

router.get('/states', getStates);
router.put('/state/:isoCode', [authJwt.verifyToken, authJwt.isAdmin], updateStateConfig);

export default router;
