import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { predictionRouter } from './controllers/prediction';
import { ErrorHandler } from './middleware/errorHandler';
import { ApiError } from './utils/apiError';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Use Helmet for security headers

app.use('/api', predictionRouter);

// handling unknown routes
app.use((req: Request, res:Response, next: NextFunction) => {
    logger.error('Unknow route', req.url);
    throw new ApiError(`Route ${req.url} not found`, 404)
})

// Global error handler
app.use(ErrorHandler)

// Start the server
try {
    app.listen(PORT, ()=> {
        logger.info('Server Running on PORT ', PORT);
    })
} catch (error) {
    logger.error(' Error starting server on port ', PORT)
}