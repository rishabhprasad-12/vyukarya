import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If it's an instance of our custom ApiError, use its status code
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    // Only show stack trace during development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
