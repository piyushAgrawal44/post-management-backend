// validators/auth.validator.js
import Joi from "joi";

// Common schema used for both signup and login
const authFields = {
  emailOrUserName: Joi.string().min(3).required().messages({
    "string.empty": "Email or Username is required",
    "string.min": "Email or Username must be at least 3 characters",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
};

export const signupSchema = Joi.object(authFields);
export const loginSchema = Joi.object(authFields);
export const adminLoginSchema = Joi.object(authFields);
