import express from 'express';
import {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} from '../controllers/subCategory.controller.js';
import { authJwt } from '../middlewares/authJwt.js';
import { upload, processImageAndUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSubCategories);

router.post('/create', [authJwt.verifyToken, authJwt.isAdmin, upload.single('image'), processImageAndUpload], createSubCategory);

router.route('/:id')
  .put([authJwt.verifyToken, authJwt.isAdmin, upload.single('image'), processImageAndUpload], updateSubCategory)
  .delete([authJwt.verifyToken, authJwt.isAdmin], deleteSubCategory);

export default router;
