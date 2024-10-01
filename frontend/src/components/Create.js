import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CreateAdvertiser = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Link: '',
    Hotline: '',
    Mail: '',
    Profile: '',
    Loc: '',
    CompanyDes: '',
    Services: '',
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
      const response = await axios.post('http://localhost:8000/home/adver/createadver', formData);
      console.log('Response:', response.data);
      if (response.status === 200) {
        setCreatedId(response.data._id);
        navigate('/list', { state: { id: response.data._id } }); // Pass ID via state
      }
    } catch (error) {
      console.error("Error creating advertiser:", error.response ? error.response.data : error.message);
      alert("Error creating advertiser: " + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create Advertiser</h2>
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
          <p>Advertiser created successfully!</p>
          <Link to={`/advertiser/${createdId}`}>View Advertiser Details</Link>
        </div>
      )}
    </div>
  );
};

export default CreateAdvertiser;
