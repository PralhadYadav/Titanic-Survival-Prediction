import { logger } from "./logger";

export type PredictionInput = {
    Pclass:string,
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

        if (passangerData.Pclass || !validPclass.includes(passangerData.Pclass)) {
            logger.error('Invalid Passenger Class:', passangerData.Pclass);
            return 'Passanger Class is not valid';
        }

        if (passangerData.Sex || !validSex.includes(passangerData.Sex)) {
            logger.error('Invalid Gender:', passangerData.Sex);
            return "Invalid Gender"
        }

        if (!passangerData.Embarked || !validEmbarked.includes(passangerData.Embarked)){
            logger.error('Invalid Embarked:', passangerData.Embarked);
            return 'Invalid Embarked'
        }

        if (!passangerData.SibSp || !passangerData.Fare || !passangerData.Age || !passangerData.Parch) {
            logger.error('Input Data missing');
            return 'Invalid Input Data'
        }

        return null;
    }
    catch (err) {
        logger.error('Error during data validation:', err);
        return 'Unable to validate Data'
    }
}