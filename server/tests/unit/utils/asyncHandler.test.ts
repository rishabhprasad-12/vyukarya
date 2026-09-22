import { NextFunction, Response, Request } from "express";
import { asyncHandler } from "../../../src/utils/asyncHandler";
import { describe, expect, it, vi } from "vitest";

describe("asyncHandler", () => {
    it("should execute the wrapped handler", async () => {
        const handler = vi.fn(async () => {});

        const wrappedHandler = asyncHandler(handler);

        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn() as NextFunction;

        await wrappedHandler(req, res, next);

        expect(handler).toHaveBeenCalledOnce();
        expect(next).not.toHaveBeenCalled();
    })

    it("should pass error to next", async () => {
        const error = new Error("Something went wrong");

        const handler = vi.fn(async () => {
            throw error;
        });

        const wrappedHandler = asyncHandler(handler);

        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn() as NextFunction;

        await wrappedHandler(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(next).toHaveBeenCalledWith(error);
    })
})