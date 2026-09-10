import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../service/auth.service";
import { ApiResponse } from "../utils/ApiResponse";

// Register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.register(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "Register successfully", data));
});

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.login(req.body);

  return res.status(200).json(new ApiResponse(200, "Login successfully", data));
});

// Get all users
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getUsers();

  res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
}); 

// Get user by id
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.params.id as string);

  res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
}) 