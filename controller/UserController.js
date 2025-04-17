import { TryCatchHandler } from "../middleware/errorMiddleWare.js";
import { User } from "../model/User.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { isInValidateField, sendResponse } from "../utils/feature.js";

export const signup = TryCatchHandler(async (req, res, next) => {
  const isInvalidate = isInValidateField(arr, req.body);
  if (isInvalidate) return next(new ErrorHandler(isInvalidate, 400));

  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser)
    return next(new ErrorHandler("Email is already in use", 400));

  if (roleCounts > 1)
    return next(new ErrorHandler("Not more than two Users are allowed"));

  await User.create(req.body);

  return sendResponse(res, 201, "User Registered Successfully");
});

export const login = TryCatchHandler(async (req, res, next) => {
  const { emailOrUserName, password } = req.body;

  if (!emailOrUserName || !password)
    return next(new ErrorHandler("Please enter email and password", 400));

  const user = await User.findOne({ emailOrUserName });
  if (!user) return next(new ErrorHandler("Account does not exists", 404));

  const isMatchPassword = await User.matchPassword(password);
  if (!isMatchPassword) return next(new ErrorHandler("Invalid password", 400));

  const token = await User.generateToken();

  return sendResponse(res, 200, "Login Successfully", token);
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
    return sendResponse(res, 201, "Login Successfully", tokenForAdmin);
  }

  const isMatchPassword = await User.matchPassword(password);
  if (!isMatchPassword) return next(new ErrorHandler("Invalid password", 400));

  const token = await User.generateToken();

  return sendResponse(res, 200, "Login Successfully", token);
});

export const getMyProfile = TryCatchHandler(async (req, res, next) => {
  const user = await User.findById(req.user?._id).select([
    "-password",
    "-role",
    "-__v",
  ]);
  if (!user) return next(new ErrorHandler("No User Found", 404));
  return sendResponse(res, 200, "My Profile", user);
});
export const getAllUser = TryCatchHandler(async (req, res, next) => {
  const search = req?.query?.search || "";
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const searchFilter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  const allUser = await User.find(searchFilter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return sendResponse(res, 200, "My Profile", allUser);
});
