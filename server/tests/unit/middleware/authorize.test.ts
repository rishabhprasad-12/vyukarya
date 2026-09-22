import { describe, expect, it, vi } from "vitest";

import { Request, Response, NextFunction } from "express";

import { authorize } from "../../../src/middleware/role.middleware";
import { ApiError } from "../../../src/utils/ApiError";

describe("authorize middleware", () => {
  it("should call next when user has an allowed role", () => {
    const req = {
      user: {
        role: "Admin",
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const middleware = authorize("Admin", "Owner");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("should throw 401 when user is not authenticated", () => {
    const req = {} as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const middleware = authorize("Admin");

    expect(() => {
      middleware(req, res, next);
    }).toThrow(ApiError);

    expect(() => {
      middleware(req, res, next);
    }).toThrow("Unauthorized");

    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 403 when user role is not allowed", () => {
    const req = {
      user: {
        role: "Member",
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const middleware = authorize("Admin", "Owner");

    expect(() => {
      middleware(req, res, next);
    }).toThrow(ApiError);

    expect(() => {
      middleware(req, res, next);
    }).toThrow("Forbidden. Access denied");

    expect(next).not.toHaveBeenCalled();
  });

  it("should throw 403 when user role is missing", () => {
    const req = {
      user: {},
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const middleware = authorize("Admin");

    expect(() => {
      middleware(req, res, next);
    }).toThrow(ApiError);

    expect(() => {
      middleware(req, res, next);
    }).toThrow("Forbidden. Access denied");

    expect(next).not.toHaveBeenCalled();
  });
});
