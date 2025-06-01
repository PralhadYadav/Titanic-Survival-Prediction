import { logger } from "./logger";

export type PredictionInput = {
    Pclass: string,
    Sex: string;
    Age: number;
    SibSp: number;
    Parch: number;
    Fare: number;
    Embarked: string;
}

export interface PredictionResult {
    prediction: boolean;
    accuracy: number;
}

/**
 * @swagger
 * summary: Validate Passenger Data
 * description: This function validates the passenger data to ensure it meets the required criteria for prediction.
 */
export const validateData = (passangerData: PredictionInput) => {
    try {
        const validPclass = ['1', '2', '3']
        const validSex = ["male", "female"];
        const validEmbarked = ["C", "Q", "S"];

        if (!passangerData.Pclass || !validPclass.includes(passangerData.Pclass)) {
            logger.error('Invalid Passenger Class:', passangerData.Pclass);
            return 'Passanger Class is not valid';
        }

        if (!passangerData.Sex || typeof passangerData.Sex !== 'string' || !validSex.includes(passangerData.Sex)) {
            logger.error('Invalid Gender:', passangerData.Sex);
            return "Invalid Gender"
        }

        if (!passangerData.Embarked || typeof passangerData.Embarked !== 'string' || !validEmbarked.includes(passangerData.Embarked)) {
            logger.error('Invalid Embarked:', passangerData.Embarked);
            return 'Invalid Embarked';
        }

        if (!passangerData.Age || typeof passangerData.Age !== 'number' || passangerData.Age <= 0) {
            logger.error('Input Passanger Age ', passangerData.Age);
            return 'Invalid Age Data';
        }

        if (!passangerData.Fare || typeof passangerData.Fare !== 'number' || passangerData.Fare < 0) {
            logger.error('Invalid fare amount ', passangerData.Fare)
            return 'Invalid fare amount';
        }

        if (!passangerData.Parch || typeof passangerData.Parch !== 'number' || passangerData.Parch < 0) {
            logger.error('Invalid Parch Data ', passangerData.Parch)
            return 'Invalid Parch Data';
        }

        if (!passangerData.SibSp || typeof passangerData.SibSp !== 'number' || passangerData.SibSp < 0) {
            logger.error('Invalid SibSp Data ', passangerData.SibSp)
            return 'Invalid SibSp Data';
        }

        return null;
    }
    catch (err) {
        logger.error('Error during data validation:', err);
        return 'Unable to validate Data'
    }
}