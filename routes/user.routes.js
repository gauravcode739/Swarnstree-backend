import express from 'express';
import { register, login, getUsers } from '../controllers/user.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

router.post('/register', validationMiddleware(true), register);
router.post('/login', validationMiddleware(true), login);
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], getUsers);

export default router;
