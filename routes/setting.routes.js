import express from 'express';
import { getSettings, updateSettings } from '../controllers/setting.controller.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', [authJwt.verifyToken, authJwt.isAdmin], updateSettings);

export default router;
