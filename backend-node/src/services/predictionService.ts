import {Request, Response, NextFunction} from 'express';
import { PythonShell } from 'python-shell';
import path from 'path';
import { ApiError } from '../utils/apiError';
import { PredictionResult, validateData } from '../utils/validations';

const MODEL_PATH = path.join(__dirname, '../models/titanic_model.pkl');
const PYTHON_SCRIPT_PATH = path.join(__dirname, '../models/predict.py');

const runPythonScript = (scriptName: string, options: any): Promise<any[]> => {
    return PythonShell.run(scriptName, options);
};

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

export const predictSurvival = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const passangerData = req.body;
        const error = validateData(passangerData);
        const scriptInput = parseScriptInput(passangerData)
        const options = {
            mode: 'json' as 'json',
            pythonOptions: ['-u'],
            scriptPath: path.dirname(PYTHON_SCRIPT_PATH),
            args: [MODEL_PATH, JSON.stringify(scriptInput)] 
        };

        if(error){
            console.log(error)
            throw new ApiError(error, 400);
        }

        const results: any[] = await runPythonScript(path.basename(PYTHON_SCRIPT_PATH), options);

        // console.log('Python script results:', results);

        if (!results || results.length === 0) {
            throw new ApiError('No response received from Python script.', 500);
        }

        const result: PredictionResult | { error: string } = results[0];

        if (result && typeof result === 'object' && 'error' in result) {
            throw new ApiError(`Python script returned an error. ${result.error}`, 500);
        } else if (result && typeof result === 'object' && 'prediction' in result && 'accuracy' in result) {
           res.status(200).json({success: true, message: result}) // Return the valid prediction result.
        } else {
            throw new ApiError('Invalid response format from Python script.', 500);
        }
    } catch (error) {
        console.log(error)
        next(error) 
    }
}