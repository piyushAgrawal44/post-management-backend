// validators/post.validator.js
import Joi from "joi";

export const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title should be at least 3 characters",
    "string.max": "Title should not exceed 100 characters",
  }),
  content: Joi.string().min(5).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content should be at least 5 characters",
  }),
});

export const getAllPostsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
});
