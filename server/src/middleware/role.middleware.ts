import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError"

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!req.user.role || !roles.includes(req.user.role)) {
           throw new ApiError(403, "Forbidden. Access denied");
        }

        next()
    }
}

