import express from 'express';
import { createVideo, getVideos, updateVideo, deleteVideo } from '../controllers/video.controller.js';
import validationMiddleware from '../middlewares/schemaValidator.js';
import { authJwt } from '../middlewares/authJwt.js';
import { upload, processImageAndUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/create', [authJwt.verifyToken, authJwt.isAdmin, upload.single('videoFile'), processImageAndUpload, validationMiddleware(true)], createVideo);
router.get('/', getVideos);

router.route('/:id')
  .put([authJwt.verifyToken, authJwt.isAdmin, upload.single('videoFile'), processImageAndUpload], updateVideo)
  .delete([authJwt.verifyToken, authJwt.isAdmin], deleteVideo);

export default router;
