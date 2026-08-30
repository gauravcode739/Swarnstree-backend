import Joi from 'joi';

export const createProductValidator = Joi.object({
  sku: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string(), // ObjectId as string
  material: Joi.string().required(),
  purity: Joi.string().optional(),
  makingCharges: Joi.number().optional(),
  hallmark: Joi.string().optional(),
  gender: Joi.string().valid('Men', 'Women', 'Kids', 'Unisex').optional(),
  weight: Joi.number().optional(),
  size: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
  price: Joi.number().required(),
  discountPrice: Joi.number().optional(),
  stock: Joi.number().required(),
  images: Joi.array().items(Joi.string()).optional(),
  gemstones: Joi.array().items(
    Joi.object({
      type: Joi.string(),
      cut: Joi.string(),
      clarity: Joi.string(),
      color: Joi.string(),
      carat: Joi.number()
    })
  ).optional(),
  variants: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      value: Joi.string(),
      priceDifference: Joi.number()
    })
  ).optional()
});

export const updateProductValidator = createProductValidator.fork(
  ['sku', 'name', 'description', 'material', 'price', 'stock'],
  (schema) => schema.optional()
);
