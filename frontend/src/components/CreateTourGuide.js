import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CreateTourGuide = ({setselectedTourGuideId}) => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Age: '',
    LanguagesSpoken: '',
    MobileNumber: '',
    YearsOfExperience: '',
    PreviousWork: '',
  });
  const [createdId, setCreatedId] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    try {
      const response = await axios.post('http://localhost:8000/TourGuide/add', formData);
      console.log('Response:', response.data);
      setselectedTourGuideId(response.data._id);
      if (response.status === 200) {
        setCreatedId(response.data._id);
        navigate('/tour-guide', { state: { id: response.data._id } }); // Pass ID via state
      }
    } catch (error) {
      console.error("Error creating tour guide:", error.response ? error.response.data : error.message);
      alert("Error creating tour guide: " + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create Tour Guide</h2>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}:</label>
            <input 
              type="text" 
              name={key} 
              value={formData[key]} 
              onChange={handleChange} 
              required 
            />
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
