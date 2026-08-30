import Joi from 'joi';

// Cart
export const addToCartValidator = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  price: Joi.number().min(0).required()
});

// Wishlist
export const toggleWishlistValidator = Joi.object({
  product: Joi.string().required()
});

// Coupon
export const createCouponValidator = Joi.object({
  code: Joi.string().required(),
  discountPercentage: Joi.number().min(1).max(100).required(),
  maxDiscountAmount: Joi.number().min(0).required(),
  expiryDate: Joi.date().required()
});

// Review
export const createReviewValidator = Joi.object({
  product: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional()
});

// Shipping
export const createShippingValidator = Joi.object({
  method: Joi.string().required(),
  cost: Joi.number().min(0).required(),
  estimatedDays: Joi.number().min(1).required()
});

// Banner
export const createBannerValidator = Joi.object({
  title: Joi.string().required(),
  image: Joi.string().required(),
  link: Joi.string().optional()
});

// Video
export const createVideoValidator = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().required(),
  platform: Joi.string().valid('Insta', 'Youtube Shorts').required(),
  thumbnail: Joi.string().optional()
});

// Payment
export const createPaymentValidator = Joi.object({
  orderId: Joi.string().required(),
  paymentMethod: Joi.string().valid('COD', 'Card', 'UPI', 'NetBanking', 'Online').required(),
  transactionId: Joi.string().when('paymentMethod', { 
    is: 'COD', 
    then: Joi.optional(), 
    otherwise: Joi.required() 
  }),
  amount: Joi.number().min(0).required(),
  status: Joi.string().valid('Pending', 'Completed', 'Failed', 'Refunded').required()
});

// Admin Auth
export const adminAuthValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
