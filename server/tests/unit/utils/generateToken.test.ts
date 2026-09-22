/// <reference types="node" />

import { describe, beforeEach, it, expect } from "vitest";
import { generateToken } from "../../../src/utils/generateToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../../../src/utils/ApiError";

describe("generateToken", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("should generate a JWT token", () => {
    const token = generateToken("user123", "Member");

    expect(typeof token).toBe("string");

    expect(token.length).toBeGreaterThan(0);
  });

  it("should generate a token containing user id and role", () => {
    const token = generateToken("user123", "Member");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    expect(decoded.id).toBe("user123");
    expect(decoded.role).toBe("Member");
  });

  it("should throw ApiError when JWT_SECRET is missing", () => {
    delete process.env.JWT_SECRET;

    expect(() => generateToken("user123", "Member")).toThrow(ApiError);
    expect(() => generateToken("user123", "Member")).toThrow(
      "JWT_SECRET is not define in environment variable",
    );
  });
});
