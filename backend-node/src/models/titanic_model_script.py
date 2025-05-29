# Titanic Survival Prediction and Model Export to .pkl
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import pickle

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

train = pd.read_csv('../input/titanic/train.csv')

train.loc[:, 'Age'] = train['Age'].fillna(train['Age'].median())

train.loc[:, 'Embarked'] = train['Embarked'].fillna(train['Embarked'].mode()[0])

train.drop(['Cabin', 'Name', 'Ticket', 'PassengerId'], axis=1, inplace=True)

sex = pd.get_dummies(train['Sex'], drop_first=True, dtype=int)
embark = pd.get_dummies(train['Embarked'], drop_first=True, dtype=int)
pcl = pd.get_dummies(train['Pclass'], drop_first=True, dtype=int)

train = pd.concat([train.drop(['Sex', 'Pclass', 'Embarked'], axis=1), sex, pcl, embark], axis=1)

X = train.drop('Survived', axis=1)
y = train['Survived']

expected_column_order = [
    'Age', 'SibSp', 'Parch', 'Fare', 'male', '2', '3', 'Q', 'S'
]

X.columns = X.columns.astype(str)

for col in expected_column_order:
    if col not in X.columns:
        X[col] = 0
X = X[expected_column_order]


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

model.model_accuracy = accuracy

with open('titanic_model.pkl', 'wb') as file:
    pickle.dump(model, file)

print(f"Model saved to titanic_model.pkl with accuracy: {model.model_accuracy:.4f}")
