import Joi from 'joi';

export const createCategoryValidator = Joi.object({
  name: Joi.string().required(),
  parentCategory: Joi.string().optional()
});
