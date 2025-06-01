import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

enum Pclass {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  NONE = ''
}

enum Gender {
  MALE = "male",
  FEMALE = "female",
  NONE = ''
}

enum Embarked {
  C = "C",
  Q = "Q",
  S = "S",
  NONE = ''
}

type PassangerForm = {
  Pclass: Pclass,
  Sex: Gender;
  Age: string | number;
  SibSp: string | number;
  Parch: string | number;
  Fare:string | number;
  Embarked: string;
}

const initialState: PassangerForm = {
  Pclass: Pclass.NONE,
  Sex: Gender.NONE,
  Age: '',
  SibSp: '',
  Parch: '',
  Fare: '',
  Embarked: Embarked.NONE,
}

const initalResult = {
  accuracy: 0,
  prediction: 0,
  survival_probability: 0
}

const App = () => {
  const [state, setState] = useState(initialState);
  const [result, setResult] = useState(initalResult);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    try {
      const { name, value } = e.target;
      setState({ ...state, [name]: name === "Age" || name === "SibSp" || name === "Parch" || name === "Fare" ? Number(value) : value });
    } catch (error) {
      alert(`something went wrong please try again ${error}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setShowResult(false);
      const res = await axios.post(`http://localhost:5000/api/predict`, state)
      const { success, message } = res.data;
      if (success) {
        setShowResult(true);
        setResult(message);
      }
      else {
        setLoading(false);
        setShowResult(false);
        alert('Something went wrong, please try again later');
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error details:', error);
      setLoading(false);
      setShowResult(false);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.message || 'An error occurred'}`);
      } else if (error.message) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unexpected error occurred');
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Please Enter Passenger Details to check if he/she Survived</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Passenger Class:</label>
            <select value={state.Pclass} name="Pclass" onChange={handleChange} required>
              <option value={Pclass.NONE}>  </option>
              <option value={Pclass.FIRST}>First</option>
              <option value={Pclass.SECOND}>Second</option>
              <option value={Pclass.THIRD}>Third</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <select value={state.Sex} name="Sex" onChange={handleChange} required>
              <option value={Gender.NONE}>  </option>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="Age"
              value={state.Age}
              placeholder="Age"
              onChange={handleChange}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label>Number of siblings/spouses aboard:</label>
            <input
              type="number"
              name="SibSp"
              value={state.SibSp}
              placeholder="Number of siblings/spouses aboard"
              onChange={handleChange}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label>Number of parents/children aboard:</label>
            <input
              type="number"
              name="Parch"
              value={state.Parch}
              placeholder="Number of parents/children aboard"
              onChange={handleChange}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label>Passenger Fare:</label>
            <input
              type="number"
              name="Fare"
              value={state.Fare}
              placeholder="Passenger Fare"
              onChange={handleChange}
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label>Passenger Embarked:</label>
            <select value={state.Embarked} name="Embarked" onChange={handleChange} required>
              <option value={Embarked.NONE}> </option>
              <option value={Embarked.C}>C</option>
              <option value={Embarked.Q}>Q</option>
              <option value={Embarked.S}>S</option>
            </select>
          </div>

          <button style={{ fontSize: '20px' }} type='submit'>Submit</button>
        </form>
        {loading && <p>Loading...</p>}
        {showResult && !loading && <p>{
          <>
            <label className="form-group"> Prediction : {result.prediction === 1 ? 'Congretulations Passanger Survived' : 'Sorry, Passanger is no more'}</label>
            <label className="form-group"> Accuracy : {result.accuracy}</label>
          </>
        }</p>}
      </header>
    </div>
  );
}

export default App;
