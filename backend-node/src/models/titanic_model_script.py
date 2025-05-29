# Titanic Survival Prediction and Model Export to .pkl

# 1. Import libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import pickle

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# 2. Load dataset
# Ensure 'train.csv' is in a location accessible by this script.
# If it's in the same directory, you can use 'train.csv'.
# If it's in a parent directory's 'input/titanic' folder, '../input/titanic/train.csv' is correct.
train = pd.read_csv('../input/titanic/train.csv')

# 3. Data preprocessing
# Fill missing Age values with median
train.loc[:, 'Age'] = train['Age'].fillna(train['Age'].median())

# Fill Embarked missing values with mode
train.loc[:, 'Embarked'] = train['Embarked'].fillna(train['Embarked'].mode()[0])

# Drop columns not needed
# Note: PassengerId is dropped from the training DataFrame as it's not a feature
# Cabin and Name are dropped as they are often too sparse or complex for basic models
train.drop(['Cabin', 'Name', 'Ticket', 'PassengerId'], axis=1, inplace=True)

# Convert categorical variables using get_dummies
# drop_first=True avoids multicollinearity for linear models, which is good for Logistic Regression
# dtype=int ensures the new dummy columns are integers (0 or 1)
sex = pd.get_dummies(train['Sex'], drop_first=True, dtype=int)
embark = pd.get_dummies(train['Embarked'], drop_first=True, dtype=int)
pcl = pd.get_dummies(train['Pclass'], drop_first=True, dtype=int)


# Concatenate new one-hot encoded columns and drop the original categorical columns.
# The .drop() method is used within pd.concat to remove the original 'Sex', 'Pclass', and 'Embarked'
# columns *before* they are concatenated with their newly created dummy variables.
train = pd.concat([train.drop(['Sex', 'Pclass', 'Embarked'], axis=1), sex, pcl, embark], axis=1)

# The problematic line that caused the KeyError is commented out/removed.
# It was attempting to drop columns that no longer existed after the pd.concat operation.
# train.drop(['Sex', 'Embarked', 'Pclass'], axis=1, inplace=True)

# 4. Split data into features and target
# 'Survived' is the target variable, all other columns are features (X)
X = train.drop('Survived', axis=1)
y = train['Survived']

# 5. Train-test split
# Split the data into training and testing sets for model development and evaluation.
# test_size=0.2 means 20% of the data will be used for testing.
# random_state=42 ensures reproducibility of the split.
# Ensure column names are strings for consistency, especially important for some libraries or frameworks
X.columns = X.columns.astype(str)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Model training
# Initialize and train the Logistic Regression model.
# max_iter increased to 200 to help with convergence for some datasets.
model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

# 7. Evaluation
# Make predictions on the test set
y_pred = model.predict(X_test)

# Print evaluation metrics to assess model performance
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# 8. Save model to .pkl file
# This serializes the trained model object so it can be loaded and used later without retraining.
with open('titanic_model.pkl', 'wb') as file:
    pickle.dump(model, file)

print("Model saved to titanic_model.pkl")
