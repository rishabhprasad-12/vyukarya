import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../service/auth.service";
import { ApiResponse } from "../utils/ApiResponse";

// Register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.register(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Register successfully", data));
});

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.login(req.body);

  return res.status(200).json(new ApiResponse(200, "Login successfully", data));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.getMe(req.user.id as string);

  res.status(200).json(new ApiResponse(200, "User fetched successfully", data));
})