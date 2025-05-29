import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { logger } from "../utils/logger";

/**
 * @swagger
 * summary: General Error Handler
 * description: Handles errors that occur in the application.
 */
export const ErrorHandler = (err: ApiError, req:Request, res: Response, next: NextFunction) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';

    logger.error(`${req.method} ${req.url} - ${message}`);
    
    res.status(statusCode).json({
        success: false,
        message
    })
}