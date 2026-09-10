import bcrypt from "bcryptjs";
import User from "../models/User";
import { LoginInput, RegisterInput } from "../types/auth.types";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/generateToken";

// User Registration 
export const register = async (data: RegisterInput) => {
    const { name, email, password } = data;

    if (password.length < 6) {
        throw new ApiError(408, "Password must be at least 6 digit")
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name, email, password: hashedPassword, role: "Member"
    })

    const token = generateToken(user._id.toString(), user.role);

    return {user, token}
} 


// User Login
export const login = async (data: LoginInput) => {
    const {email, password} = data;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email and password")
    }

    const token = generateToken(user._id.toString(), user.role);

    return {user, token};
}

// getUsers
export const getUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 }).select("-password");

  if (!users) {
    throw new ApiError(404, "Database empty");
  }

  return users;
};

// getProfile (get user by id)
export const getProfile = async (userId: string) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
}

