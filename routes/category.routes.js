import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';
import { upload, processImageAndUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/create', [authJwt.verifyToken, authJwt.isAdmin, upload.single('image'), processImageAndUpload, validationMiddleware(true)], createCategory);
router.get('/', getCategories);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin, upload.single('image'), processImageAndUpload], updateCategory);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], deleteCategory);

export default router;
