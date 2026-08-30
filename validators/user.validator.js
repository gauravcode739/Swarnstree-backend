import Joi from 'joi';

export const registerValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  password: Joi.string().min(6).required()
});

export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
