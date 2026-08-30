import { createProductValidator, updateProductValidator } from './product.validator.js';
import Joi from 'joi';

// Guest Order Validator
export const createOrderValidator = Joi.object({
  user: Joi.string().optional(),
  guestDetails: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()
  }).when('user', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zipCode: Joi.string().required()
  }).required(),
  shippingModel: Joi.string().optional(),
  couponApplied: Joi.string().optional(),
  totalAmount: Joi.number().min(0).required(),
  paymentMethod: Joi.string().optional()
});

import { registerValidator, loginValidator } from './user.validator.js';
import { createCategoryValidator } from './category.validator.js';
import { 
  addToCartValidator, toggleWishlistValidator, createCouponValidator, 
  createReviewValidator, createShippingValidator, createBannerValidator, 
  createVideoValidator, createPaymentValidator, adminAuthValidator 
} from './ecommerce.validator.js';

export const validators = {
  "/api/v1/products/create": createProductValidator,
  "/api/v1/products/update/:id": updateProductValidator,
  "/api/v1/orders/create": createOrderValidator,
  "/api/v1/users/register": registerValidator,
  "/api/v1/users/login": loginValidator,
  "/api/v1/categories/create": createCategoryValidator,
  "/api/v1/cart/add": addToCartValidator,
  "/api/v1/wishlist/toggle": toggleWishlistValidator,
  "/api/v1/coupons/create": createCouponValidator,
  "/api/v1/reviews/create": createReviewValidator,
  "/api/v1/shipping/create": createShippingValidator,
  "/api/v1/banners/create": createBannerValidator,
  "/api/v1/videos/create": createVideoValidator,
  "/api/v1/payments/create": createPaymentValidator,
  "/api/v1/admin/login": adminAuthValidator,
  "default": "No validator found for this route."
};
