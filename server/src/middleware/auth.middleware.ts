import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized. Token missing");
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new ApiError(
        500,
        "JWT_SECRET is not defined in environment variable",
      );
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string" || !decoded || !("id" in decoded)) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    (req as Request & { user?: typeof user }).user = user;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, "Invalid or expired token"))
    }

    return next(error);
  }
};
