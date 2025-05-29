import sys
import json
import pickle
import pandas as pd
import numpy as np

# --- Configuration ---
MODEL_FILE = sys.argv[1] # Path to the .pkl model is passed as the first argument

def load_model(model_path):
    """Loads the trained model from a .pkl file."""
    try:
        with open(model_path, 'rb') as file:
            model = pickle.load(file)
        return model
    except FileNotFoundError:
        return {"error": f"Model file not found at {model_path}"}
    except Exception as e:
        return {"error": f"Error loading model: {str(e)}"}

def preprocess_input(input_data):
    """
    Preprocesses raw input data into a DataFrame suitable for the model.
    Handles type conversions, missing values, and categorical encoding
    consistent with training.
    """
    # Define expected columns and their types for validation and conversion
    expected_features = {
        'Pclass': int,
        'Sex': str,
        'Age': float,
        'SibSp': int,
        'Parch': int,
        'Fare': float,
        'Embarked': str
    }

    processed_data = {}
    for feature, expected_type in expected_features.items():
        value = None
        if feature in input_data:
            value = input_data[feature]
        elif feature.lower() in input_data:
            value = input_data[feature.lower()]
        elif feature.capitalize() in input_data:
            value = input_data[feature.capitalize()]

        if value is None:
            return {"error": f"Missing required feature: '{feature}' in input data."}

        try:
            if expected_type == int:
                processed_data[feature] = int(value)
            elif expected_type == float:
                processed_data[feature] = float(value)
            else: # For strings
                processed_data[feature] = str(value)
        except ValueError:
            return {"error": f"Invalid type for '{feature}'. Expected {expected_type.__name__}, got '{value}'."}

    # Create a DataFrame from the single input row
    df = pd.DataFrame([processed_data])

    df_sex_dummies = pd.get_dummies(df['Sex'], drop_first=True, dtype=int)
    df_pclass_dummies = pd.get_dummies(df['Pclass'], drop_first=True, dtype=int)
    df_embarked_dummies = pd.get_dummies(df['Embarked'], drop_first=True, dtype=int)

    df = df.drop(columns=['Sex', 'Pclass', 'Embarked'], errors='ignore')

    df = pd.concat([df, df_sex_dummies, df_pclass_dummies, df_embarked_dummies], axis=1)

    for col in ['male', '2', '3', 'Q', 'S']:
        if col not in df.columns:
            df[col] = 0

    df['2'] = df['2'].astype(int)
    df['3'] = df['3'].astype(int)

    expected_column_order = [
        'Age', 'SibSp', 'Parch', 'Fare', 'male', '2', '3', 'Q', 'S'
    ]

    try:
        df.columns = df.columns.astype(str)
        df = df[expected_column_order]
    except KeyError as e:
        return {"error": f"Feature mismatch after preprocessing. Missing or extra column: {e}. Expected: {expected_column_order}"}

    return df

# --- Main script execution ---
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing input arguments. Usage: python predict.py <model_path> <json_data_string>"}), file=sys.stderr)
        sys.exit(1)

    input_json_str = sys.argv[2]
    print(f"Raw input JSON string received: {input_json_str}", file=sys.stderr)


    try:
        raw_input_data = json.loads(input_json_str)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON format. Details: {str(e)}"}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Unexpected error during JSON parsing: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

    # 2. Preprocess the input data
    processed_df_result = preprocess_input(raw_input_data)
    if isinstance(processed_df_result, dict) and "error" in processed_df_result:
        print(json.dumps(processed_df_result), file=sys.stderr) # Preprocessing error
        sys.exit(1)

    input_df = processed_df_result

    # 3. Load the model
    model_load_result = load_model(MODEL_FILE)
    if isinstance(model_load_result, dict) and "error" in model_load_result:
        print(json.dumps(model_load_result), file=sys.stderr) # Model loading error
        sys.exit(1)

    model = model_load_result

    # 4. Make prediction
    try:
        prediction_proba = model.predict_proba(input_df)[0]
        prediction = int(model.predict(input_df)[0])

        survival_probability = prediction_proba[1]

        model_accuracy_placeholder = 0.785

        response = {
            "prediction": prediction,
            "survival_probability": round(float(survival_probability), 4),
            "accuracy": model_accuracy_placeholder
        }
        print(json.dumps(response))

    except Exception as e:
        print(json.dumps({"error": f"Error during prediction: {str(e)}"}), file=sys.stderr)
        sys.exit(1)
