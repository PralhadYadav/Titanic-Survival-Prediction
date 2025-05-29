import pickle
import sys
import os

model_path = 'titanic_model.pkl'

if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}")
        sys.exit(1)

try:
        with open(model_path, 'rb') as file:
            loaded_object = pickle.load(file)

        print(f"Successfully loaded object from {model_path}")

        if isinstance(loaded_object, (list, tuple, dict)) or 'numpy' in str(type(loaded_object)):
            print(f"Loaded object content (first few items/shape): {loaded_object if len(str(loaded_object)) < 200 else str(type(loaded_object))}")
            if hasattr(loaded_object, 'shape'):
                print(f"Shape: {loaded_object.shape}")


except Exception as e:
        print(f"Error loading or inspecting model: {e}")
    