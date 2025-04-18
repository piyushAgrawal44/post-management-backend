import { TryCatchHandler } from "../middleware/errorMiddleWare.js";
import { User } from "../model/User.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { sendResponse } from "../utils/utils.js";

export const signup = TryCatchHandler(async (req, res, next) => {
  const { emailOrUserName, password } = req.body;

  if (!emailOrUserName || !password)
    return next(new ErrorHandler("Please enter email and password", 400));

  const existingUser = await User.findOne({ emailOrUserName });

  if (existingUser)
    return next(new ErrorHandler("Email is already in use", 400));

  await User.create({ emailOrUserName, password });

  return sendResponse(res, 201, "User Registered Successfully");
});

export const login = TryCatchHandler(async (req, res, next) => {
  const { emailOrUserName, password } = req.body;

  if (!emailOrUserName || !password)
    return next(new ErrorHandler("Please enter email and password", 400));

  const user = await User.findOne({ emailOrUserName });
  if (!user) return next(new ErrorHandler("Account does not exists", 404));

  const isMatchPassword = await user.matchPassword(password);
  if (!isMatchPassword) return next(new ErrorHandler("Invalid password", 400));

  const token = await user.generateToken();

  return sendResponse(res, 200, "Login Successfully", { token });
});
export const adminLogin = TryCatchHandler(async (req, res, next) => {
  const { emailOrUserName, password } = req.body;

  if (!emailOrUserName || !password)
    return next(new ErrorHandler("Please enter email and password", 400));

  const existingAdmin = await User.findOne({ emailOrUserName });
  if (!existingAdmin) {
    // create admin instant
    const newAdmin = await User.create({ ...req.body, role: "admin" });
    const tokenForAdmin = await newAdmin.generateToken();
    return sendResponse(res, 201, "Login Successfully", {
      token: tokenForAdmin,
    });
  }

  const isMatchPassword = await existingAdmin.matchPassword(password);
  if (!isMatchPassword) return next(new ErrorHandler("Invalid password", 400));

  const token = await existingAdmin.generateToken();

  return sendResponse(res, 200, "Login Successfully", { token });
});

export const getMyProfile = TryCatchHandler(async (req, res, next) => {
  const user = await User.findById(req.user?._id).select([
    "-password",
    "-posts",
    "-__v",
  ]);
  if (!user) return next(new ErrorHandler("No User Found", 404));
  return sendResponse(res, 200, "My Profile", user);
});
