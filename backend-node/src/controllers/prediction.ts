import { Router } from 'express';
import { predictSurvival } from '../services/predictionService';

export const predictionRouter = Router();

predictionRouter.post('/predict', predictSurvival);