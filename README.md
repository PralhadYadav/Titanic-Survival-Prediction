# Titanic-Survival-Prediction

A full-stack, Dockerized web application that predicts Titanic passenger survival using a machine learning model.  
The backend is built with Node.js (TypeScript, Express) and integrates Python scripts for ML inference.  
The frontend is a React app (Typescript) for user interaction.

---

## Features

- **Predict Titanic survival** based on user input
- **REST API** with Express (TypeScript)
- **Machine Learning** model integration via Python scripts 
- **Interactive React UI** for input and results
- **Swagger API documentation**
- **Dockerized** for easy deployment and reproducibility

---

## Architecture

- **Frontend:** React app for user input and displaying predictions.
- **Backend:** Node.js (TypeScript, Express) REST API.
- **ML Integration:** Backend calls Python scripts using `python-shell` to run the trained model and return predictions.
- **Containerization:** Both frontend and backend are containerized and orchestrated with Docker Compose.

---

## Getting Started

### Prerequisites

- [Docker , Docker Compose]

### Running the Application

1. **Clone the repository:**
    ```sh
    git clone https://github.com/PralhadYadav/Titanic-Survival-Prediction.git
    cd Titanic-Survival-Prediction
    ```

2. **Build and start the containers:**
    ```sh
    docker-compose up --build
    ```

3. **Access the application:**
    - Frontend: [http://localhost:8080]
    - API: [http://localhost:5000]
    - Open React Frontend on http://localhost:8080, fill out passanger details and submit. It will call the API end point /predict which will run the script in background and check if passanger Survived the disaster or not. Once Backend respond you can see the result below Submit button.
---

## API Documentation

- Swagger docs available at: [http://localhost:5000/api/docs]

---

## Development

### Backend

- Location: `backend-node/`
- Main entry: `src/index.ts`
- To run locally (without Docker):
    ```sh
    cd backend-node
    npm install
    pip install -r requirements.txt
    npm run dev
    ```

### Frontend

- Location: `frontend-react/`
- Main entry: `src/index.tsx`
- To run locally (without Docker):
    ```sh
    cd frontend-react
    npm install
    npm start
    ```

---

## Machine Learning Model

- Python scripts and model files are in `backend-node/src/models/`
- Model dependencies are listed in `backend-node/requirements.txt`
- The backend uses `python-shell` to call Python scripts for predictions

---