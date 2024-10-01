// src/components/CreateTourGuide.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CreateTourGuide = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Age: '',
    LanguagesSpoken: '',
    MobileNumber: '',
    YearsOfExperience: '',
    PreviousWork: '',
  });
  const [createdId, setCreatedId] = useState(null); // New state for created tour guide ID

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8004/TourGuide/get', formData);
      setCreatedId(response.data._id); // Set created ID
    } catch (error) {
      console.error("Error creating tour guide:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create Tour Guide</h2>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}:</label>
            <input type="text" name={key} value={formData[key]} onChange={handleChange} required />
          </div>
        ))}
        <button type="submit">Create</button>
      </form>
      {createdId && (
        <div>
          <p>Tour guide created successfully!</p>
          <Link to={`/tour-guide/${createdId}`}>View Tour Guide Details</Link>
        </div>
      )}
    </div>
  );
};

export default CreateTourGuide;
