import multer from 'multer';
import sharp from 'sharp';
import cloudinary from '../config/cloudinary.js';

// Use memory storage so we get req.file.buffer for sharp processing
export const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit to allow large video uploads
});

// Helper function to upload a buffer to Cloudinary via stream
const streamUploadToCloudinary = (buffer, filename, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: 'swarnstree',
        public_id: `${Date.now()}_${filename.replace(/\s+/g, '_').split('.')[0]}`,
        resource_type: resourceType
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};

// Middleware to process and upload a single or multiple images
export const processImageAndUpload = async (req, res, next) => {
  try {
    // Process multiple files (upload.array)
    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = req.files.map(async (file) => {
        // Only process images/videos
        if (file.mimetype.startsWith('image/')) {
          // 1. Optimize image using sharp
          const compressedBuffer = await sharp(file.buffer)
            .resize(1200, null, { withoutEnlargement: true }) // Prevent small images from stretching
            .jpeg({ quality: 80 }) // Compress to 80% quality JPEG
            .toBuffer();

          // 2. Upload to Cloudinary
          const result = await streamUploadToCloudinary(compressedBuffer, file.originalname, 'image');
          
          // 3. Generate Optimized Delivery URL (f_auto, q_auto)
          const optimizeUrl = cloudinary.url(result.public_id, {
            fetch_format: 'auto',
            quality: 'auto',
            secure: true
          });
          
          // 4. Emulate multer-storage-cloudinary behavior so controllers don't break
          file.path = optimizeUrl;
          file.filename = result.public_id;
        } else if (file.mimetype.startsWith('video/')) {
          // Upload video buffer directly
          const result = await streamUploadToCloudinary(file.buffer, file.originalname, 'video');
          file.path = result.secure_url;
          file.filename = result.public_id;
        }
        
        return file;
      });

      await Promise.all(uploadPromises);
    } 
    // Process single file (upload.single)
    else if (req.file) {
      const file = req.file;
      if (file.mimetype.startsWith('image/')) {
        const compressedBuffer = await sharp(file.buffer)
          .resize(1200, null, { withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        const result = await streamUploadToCloudinary(compressedBuffer, file.originalname, 'image');
        
        const optimizeUrl = cloudinary.url(result.public_id, {
          fetch_format: 'auto',
          quality: 'auto',
          secure: true
        });
        
        file.path = optimizeUrl;
        file.filename = result.public_id;
      } else if (file.mimetype.startsWith('video/')) {
        const result = await streamUploadToCloudinary(file.buffer, file.originalname, 'video');
        file.path = result.secure_url;
        file.filename = result.public_id;
      }
    }

    next();
  } catch (error) {
    console.error("Error optimizing and uploading image:", error);
    res.status(500).json({ success: false, message: "Error processing image upload: " + error.message });
  }
};
