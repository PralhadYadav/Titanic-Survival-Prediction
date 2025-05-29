import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const ErrorHandler = (err: ApiError, req:Request, res: Response, next: NextFunction) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    
    res.status(statusCode).json({
        success: false,
        message
    })
}