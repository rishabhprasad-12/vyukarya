import { beforeEach, describe, expect, it, vi } from "vitest";

import bcrypt from "bcryptjs";

import User from "../../../src/models/User";
import * as authService from "../../../src/service/auth.service";
import { generateToken } from "../../../src/utils/generateToken";
import { ApiError } from "../../../src/utils/ApiError";

vi.mock("../../../src/models/User", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("../../../src/utils/generateToken", () => ({
  generateToken: vi.fn(),
}));

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // REGISTER
  describe("register", () => {
    it("should register a new user successfully", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

      vi.mocked(User.create).mockResolvedValue({
        _id: "user123",
        name: "Rishabh",
        email: "rishabh@example.com",
        password: "hashed-password",
        role: "Member",
      } as never);

      vi.mocked(generateToken).mockReturnValue("test-token");

      const result = await authService.register({
        name: "Rishabh",
        email: "rishabh@example.com",
        password: "password123",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        email: "rishabh@example.com",
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

      expect(User.create).toHaveBeenCalledWith({
        name: "Rishabh",
        email: "rishabh@example.com",
        password: "hashed-password",
        role: "Member",
      });

      expect(generateToken).toHaveBeenCalledWith("user123", "Member");

      expect(result).toEqual({
        user: {
          id: "user123",
          name: "Rishabh",
          email: "rishabh@example.com",
          role: "Member",
        },
        token: "test-token",
      });
    });

    it("should reject password shorter than 6 characters", async () => {
      await expect(
        authService.register({
          name: "Rishabh",
          email: "rishabh@example.com",
          password: "12345",
        }),
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Password must be at least 6 digit",
      });

      expect(User.findOne).not.toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
    });

    it("should reject an existing user", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        _id: "existing-user",
        email: "rishabh@example.com",
      } as never);

      await expect(
        authService.register({
          name: "Rishabh",
          email: "rishabh@example.com",
          password: "password123",
        }),
      ).rejects.toMatchObject({
        statusCode: 409,
        message: "User already exist",
      });

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
    });

    it("should not return the user's password", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

      vi.mocked(User.create).mockResolvedValue({
        _id: "user123",
        name: "Rishabh",
        email: "rishabh@example.com",
        password: "hashed-password",
        role: "Member",
      } as never);

      vi.mocked(generateToken).mockReturnValue("test-token");

      const result = await authService.register({
        name: "Rishabh",
        email: "rishabh@example.com",
        password: "password123",
      });

      expect(result.user).not.toHaveProperty("password");
    });
  });

  // LOGIN
  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        _id: "user123",
        name: "Rishabh",
        email: "rishabh@example.com",
        password: "hashed-password",
        role: "Member",
      } as never);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      vi.mocked(generateToken).mockReturnValue("test-token");

      const result = await authService.login({
        email: "rishabh@example.com",
        password: "password123",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        email: "rishabh@example.com",
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashed-password",
      );

      expect(generateToken).toHaveBeenCalledWith("user123", "Member");

      expect(result).toEqual({
        user: {
          id: "user123",
          name: "Rishabh",
          email: "rishabh@example.com",
          role: "Member",
        },
        token: "test-token",
      });
    });

    it("should reject login when user does not exist", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      await expect(
        authService.login({
          email: "unknown@example.com",
          password: "password123",
        }),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "User not found",
      });

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    it("should reject login with incorrect password", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        _id: "user123",
        name: "Rishabh",
        email: "rishabh@example.com",
        password: "hashed-password",
        role: "Member",
      } as never);

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.login({
          email: "rishabh@example.com",
          password: "wrong-password",
        }),
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email and password",
      });

      expect(generateToken).not.toHaveBeenCalled();
    });

    it("should not return the user's password", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        _id: "user123",
        name: "Rishabh",
        email: "rishabh@example.com",
        password: "hashed-password",
        role: "Member",
      } as never);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      vi.mocked(generateToken).mockReturnValue("test-token");

      const result = await authService.login({
        email: "rishabh@example.com",
        password: "password123",
      });

      expect(result.user).not.toHaveProperty("password");
    });
  });

  // GET USER BY ID
  describe("getMe", () => {
    it("should return a user when the user exists", async () => {
      const select = vi.fn().mockResolvedValue({
        _id: "user123",
        name: "Rishabh",
        email: "rishabh@example.com",
        role: "Member",
      });

      vi.mocked(User.findById).mockReturnValue({
        select,
      } as never);

      const result = await authService.getMe("user123");

      expect(User.findById).toHaveBeenCalledWith("user123");

      expect(select).toHaveBeenCalledWith("-password");

      expect(result).toEqual({
        user: {
          _id: "user123",
          name: "Rishabh",
          email: "rishabh@example.com",
          role: "Member",
        },
      });
    });

    it("should throw 404 when user does not exist", async () => {
      const select = vi.fn().mockResolvedValue(null);

      vi.mocked(User.findById).mockReturnValue({
        select,
      } as never);

      await expect(
        authService.getMe("unknown-user"),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "User not found",
      });
    });
  });
});
