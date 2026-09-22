import { ApiResponse } from "../../../src/utils/ApiResponse";
import { describe, it, expect } from "vitest";

describe("ApiResponse", () => {
  it("should create a successful response for status below 400", () => {
    const response = new ApiResponse(200, "User fetched successfully", {
      id: "123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.message).toBe("User fetched successfully");
    expect(response.success).toBe(true);
    expect(response.data).toEqual({ id: "123" });
  });

  it("should mark response as unsuccessful for status above 400", () => {
    const response = new ApiResponse(400, "Bad request", null);

    expect(response.statusCode).toBe(400);
    expect(response.success).toBe(false);
    expect(response.data).toBeNull;
  });
});
