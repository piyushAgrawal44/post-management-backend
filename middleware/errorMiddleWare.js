
import { logger } from "../winston/logger.js";
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    err.message = "Duplicate key error";
    err.statusCode = 400;
  }

  if (err.name === "CastError") err.message = "Invalid ID";

  const response = {
    success: false,
    statusCode:err.statusCode,
    message: err.message,
  };

  return res.status(err.statusCode).json(response);
};

export const TryCatchHandler = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};
