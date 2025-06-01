import {Request, Response, NextFunction} from 'express';
import { PythonShell } from 'python-shell';
import path from 'path';
import { ApiError } from '../utils/apiError';
import { PredictionResult, validateData } from '../utils/validations';
import { logger } from '../utils/logger';

const MODEL_PATH = path.join(__dirname, '../models/titanic_model.pkl');
const PYTHON_SCRIPT_PATH = path.join(__dirname, '../models/predict.py');

/**
 * @swagger
 * summary: handler to run the Python script for prediction
 * @param scriptName - The name of the Python script to run.
 * description: This function runs a Python script using the PythonShell library.
 */
const runPythonScript = (scriptName: string, options: any): Promise<any[]> => {
    logger.info(`Running Python script: ${scriptName} with options: ${JSON.stringify(options)}`);
    return PythonShell.run(scriptName, options);
};

/**
 * @swagger
 * summary: handler to parse the input data for the Python script
 * @param data - json object containing passenger data.
 * description: This function parses the input data to ensure it is in the correct format for the Python script.
 */
const parseScriptInput = (data: any) => {
    const numInputs = ['Pclass', 'Age', 'SibSp', 'Parch', 'Fare'];
    const result:any = {};
    Object.keys(data).map(key => {
        if(numInputs.includes(key)){
            result[key] = parseInt(data[key])
        } else result[key] = data[key]
    })
    return result;
}


/**
 * @swagger
 * summary: Predicts survival of Titanic passengers
 * @param data - json object containing passenger data through the request body.
 * description: This endpoint receives passenger data, validates it, and runs a Python script to predict survival based on the Titanic dataset.
 */
export const predictSurvival = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const passangerData = req.body;
        if (!passangerData || typeof passangerData !== 'object' || Object.keys(passangerData).length === 0) {
            logger.error('Invalid Passanger Data ', passangerData);
            throw new ApiError('Invalid Passanger Data ', 400);
        }

        const error = validateData(passangerData);
        if (error) {
            logger.error(error)
            throw new ApiError(error, 400);
        }

        const scriptInput = parseScriptInput(passangerData)
        const options = {
            mode: 'json' as 'json',
            pythonOptions: ['-u'],
            scriptPath: path.dirname(PYTHON_SCRIPT_PATH),
            args: [MODEL_PATH, JSON.stringify(scriptInput)] 
        };

        const results: any[] = await runPythonScript(path.basename(PYTHON_SCRIPT_PATH), options);
        if (!results || results.length === 0) {
            logger.error('No response received from Python script.');
            throw new ApiError('No response received from Python script.', 500);
        }

        const result: PredictionResult | { error: string } = results[0];

        if (result && typeof result === 'object' && 'error' in result) {
            logger.error('Invalid Passenger Class:', result.error);
            throw new ApiError(`Python script returned an error.`, 500);
        } else if (result && typeof result === 'object' && 'prediction' in result && 'accuracy' in result) {
           res.status(200).json({success: true, message: result})
        } else {
            logger.error('Invalid response format from Python script.');
            throw new ApiError('Invalid response format from Python script.', 500);
        }
    } catch (error) {
        logger.error(error)
        next(error) 
    }
}