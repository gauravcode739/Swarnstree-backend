import express from 'express';
import { createEnquiry, getEnquiries } from '../controllers/enquiryController.js';
import { authJwt } from '../middlewares/authJwt.js';

const router = express.Router();

// POST /api/v1/enquiries - Public
router.post('/', createEnquiry);

// GET /api/v1/enquiries - Admin only
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], getEnquiries);

export default router;
