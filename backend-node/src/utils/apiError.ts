/**
 * @swagger
 * summary: Api Error Class
 * description: Custom error class for handling API errors in the application.
 */
export class ApiError extends Error{
    statusCode: number;

    constructor(message: string, statusCode = 500){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}