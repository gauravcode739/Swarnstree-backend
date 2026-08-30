import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased limit to prevent issues during heavy usage
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import categoryRoutes from './routes/category.routes.js';
import subCategoryRoutes from './routes/subCategory.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import reviewRoutes from './routes/review.routes.js';
import shippingRoutes from './routes/shipping.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import bannerRoutes from './routes/banner.routes.js';
import videoRoutes from './routes/video.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminRoutes from './routes/admin.routes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import settingRoutes from './routes/setting.routes.js';

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subcategories', subCategoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/shipping', shippingRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/settings', settingRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
