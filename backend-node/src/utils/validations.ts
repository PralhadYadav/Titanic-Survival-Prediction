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

export const validateData = (passangerData: PredictionInput) => {
    try {
        const validPclass = ['1', '2', '3']
        const validSex = ["male", "female"];
        const validEmbarked = ["C", "Q", "S"];

        if (!validPclass.includes(passangerData.Pclass)) {
            return 'Passanger Class is not valid';
        }

        if (!validSex.includes(passangerData.Sex)) {
            return "Invalid Gender"
        }

        if(!validEmbarked.includes(passangerData.Embarked)){
            return 'Invalid Embarked'
        }

        return null;
    }
    catch (err) {
        return 'Unable to validate Data'
    }
}