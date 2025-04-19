// controllers/auth.controller.js
import { TryCatchHandler } from "../middleware/errorMiddleWare.js";
import { User } from "../model/User.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { sendResponse } from "../utils/utils.js";
import {
  signupSchema,
  loginSchema,
  adminLoginSchema,
} from "../validators/auth.validator.js";

// SIGNUP
export const signup = TryCatchHandler(async (req, res, next) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) return next(new ErrorHandler(error.details[0].message, 400));

  const { emailOrUserName, password } = value;

  const existingUser = await User.findOne({ emailOrUserName });
  if (existingUser)
    return next(new ErrorHandler("Email is already in use", 400));

  await User.create({ emailOrUserName, password });

  return sendResponse(res, 201, "User Registered Successfully");
});

// LOGIN
export const login = TryCatchHandler(async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return next(new ErrorHandler(error.details[0].message, 400));

  const { emailOrUserName, password } = value;

  const user = await User.findOne({ emailOrUserName });
  if (!user) return next(new ErrorHandler("Account does not exist", 404));

  const isMatchPassword = await user.matchPassword(password);
  if (!isMatchPassword)
    return next(new ErrorHandler("Invalid password", 400));

  const token = await user.generateToken();

  return sendResponse(res, 200, "Login Successfully", { token });
});

// ADMIN LOGIN
export const adminLogin = TryCatchHandler(async (req, res, next) => {
  const { error, value } = adminLoginSchema.validate(req.body);
  if (error) return next(new ErrorHandler(error.details[0].message, 400));

  const { emailOrUserName, password } = value;

  const existingAdmin = await User.findOne({ emailOrUserName });

  if (!existingAdmin) {
    // Create admin instantly
    const newAdmin = await User.create({ ...value, role: "admin" });
    const token = await newAdmin.generateToken();
    return sendResponse(res, 201, "Login Successfully", { token });
  }

  const isMatchPassword = await existingAdmin.matchPassword(password);
  if (!isMatchPassword)
    return next(new ErrorHandler("Invalid password", 400));

  const token = await existingAdmin.generateToken();

  return sendResponse(res, 200, "Login Successfully", { token });
});

// GET MY PROFILE
export const getMyProfile = TryCatchHandler(async (req, res, next) => {
  const user = await User.findById(req.user?._id).select([
    "-password",
    "-posts",
    "-__v",
  ]);
  if (!user) return next(new ErrorHandler("No User Found", 404));

  return sendResponse(res, 200, "My Profile", user);
});
