import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError";

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "JWT_SECRET is not define in environment variable");
  }

  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: "7d",
  });
};
