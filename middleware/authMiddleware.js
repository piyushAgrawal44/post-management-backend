import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/errorHandler.js";
import { TryCatchHandler } from "./errorMiddleWare.js";

const checkToken = async (req, res, next) => {
  let token = req.headers["authorization"]?.slice(7);
  if (!token) return next(new ErrorHandler("Invalid auth token", 401));
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  return decodedData;
};

export const isAuthenticated = TryCatchHandler(async (req, res, next) => {
  req.user = await checkToken(req, res, next);
  next();
});

export const isAdmin = TryCatchHandler(async (req, res, next) => {
  req.user = await checkToken(req, res, next);

  if (req?.user?.role !== "admin") {
    return next(new ErrorHandler("UnAuthorize access", 400));
  }
  next();
});
