import { describe, expect, it } from "vitest";
import { ApiError } from "../../../src/utils/ApiError";

describe("ApiError", () => {
  it("should create an ApiError with default values", () => {
    const error = new ApiError(400);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Something went wrong");
    expect(error.success).toBe(false);
    expect(error.errors).toEqual([]);
  });

  it("should store the custom message", () => {
    const error = new ApiError(404, "User not found");

    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("User not found");
    expect(error.success).toBe(false);
  });

  it("should store additional errors", () => {
    const errors = [{ field: "email", message: "Invalid email" }];

    const error = new ApiError(400, "Validation failed", errors);

    expect(error.errors).toEqual(errors);
  });
});
