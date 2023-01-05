import joi from "joi";

export const userRegSchemma = joi.object({
  email: joi.string().email().max(50).required(),
  username: joi.string().min(4).required(),
  password: joi.string().min(8).max(25).required(),
  image_url: joi.string().required(),
});

export const userLogSchemma = joi.object({
  email: joi.string().email().max(50).required(),
  password: joi.string().min(8).max(25).required(),
});