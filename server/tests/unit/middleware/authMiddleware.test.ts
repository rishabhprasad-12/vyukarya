import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../../../src/models/User";
import { protect } from "../../../src/middleware/auth.middleware";

vi.mock("../../../src/models/User", () => ({
  default: {
    findById: vi.fn(),
  },
}));

describe("protect middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("should call next when a valid token and user are provided", async () => {
    const token = jwt.sign(
      {
        id: "user123",
        role: "Member",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    const select = vi.fn().mockResolvedValue({
      _id: "user123",
      name: "Rishabh",
      email: "rishabh@example.com",
      role: "Member",
    });

    vi.mocked(User.findById).mockReturnValue({
      select,
    } as never);

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request & { user?: unknown };

    const res = {} as Response;
    const next = vi.fn();

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(select).toHaveBeenCalledWith("-password");

    expect(req.user).toEqual({
      _id: "user123",
      name: "Rishabh",
      email: "rishabh@example.com",
      role: "Member",
    });

    expect(next).toHaveBeenCalledOnce();
  });

  it("should call next with an error when token is missing", async () => {
    const req = {
      headers: {},
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe(
      "Unauthorized. Token missing",
    );
  });

  it("should call next with an error when authorization header is invalid", async () => {
    const req = {
      headers: {
        authorization: "InvalidToken",
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe(
      "Unauthorized. Token missing",
    );
  });

  it("should call next with an error when token is invalid", async () => {
    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe(
      "Invalid or expired token",
    );

    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should call next with an error when token is expired", async () => {
    const token = jwt.sign(
      {
        id: "user123",
        role: "Member",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "-1s",
      },
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe(
      "Invalid or expired token",
    );

    expect(User.findById).not.toHaveBeenCalled();
  });

  it("should call next with an error when user does not exist", async () => {
    const token = jwt.sign(
      {
        id: "unknown-user",
        role: "Member",
      },
      process.env.JWT_SECRET!,
    );

    const select = vi.fn().mockResolvedValue(null);

    vi.mocked(User.findById).mockReturnValue({
      select,
    } as never);

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith(
      "unknown-user",
    );

    expect(next).toHaveBeenCalledOnce();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("User not found");
  });

  it("should call next with 500 when JWT_SECRET is missing", async () => {
    delete process.env.JWT_SECRET;

    const req = {
      headers: {
        authorization: "Bearer some-token",
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(500);
    expect(error.message).toBe(
      "JWT_SECRET is not defined in environment variable",
    );
  });
});