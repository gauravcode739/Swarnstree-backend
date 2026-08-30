import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';
import { upload, processImageAndUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// The validationMiddleware intercept the request, looks up "/api/v1/products/create"
// in validators/index.js, and validates req.body
router.post('/create', [authJwt.verifyToken, authJwt.isAdmin, upload.array('images', 5), processImageAndUpload, validationMiddleware(true)], createProduct);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin, upload.array('images', 5), processImageAndUpload], updateProduct);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], deleteProduct);

export default router;
