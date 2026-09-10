import { Request, Response, NextFunction, RequestHandler } from "express";

// export const asyncHandler = (fn: RequestHandler) => {
//     return (req: Request, res: Response, next: NextFunction): void => {
//         Promise.resolve(fn(req, res, next)).catch(next)
//     }
// }

export const asyncHandler = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    }       
}