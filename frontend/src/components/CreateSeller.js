import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CreateSeller = () => {
  const [formData, setFormData] = useState({
    Name: '',
    PickUp_Location: '',
    Type_Of_Products: '',
    Previous_Work: '',
    Age: '',
    Email: '',
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
      const response = await axios.post('http://localhost:8000/Seller/createSeller', formData);
      console.log('Response:', response.data);

      if (response.status === 200) {
        setCreatedId(response.data._id);
        // Redirect to seller details page, passing the created seller ID
        navigate('/seller-details', { state: { id: response.data._id } });
      }
    } catch (error) {
      console.error("Error creating seller:", error.response ? error.response.data : error.message);
      alert("Error creating seller: " + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create Seller</h2>

        {/* Render each form field based on formData keys */}
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key.replace(/_/g, ' ')}:</label>
            <input 
              type={key === 'Age' ? 'number' : 'text'} // For Age, use number input type
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
          <p>Seller created successfully!</p>
          <Link to={`/seller-details`} state={{ id: createdId }}>View Seller Details</Link>
        </div>
      )}
    </div>
  );
};

export default CreateSeller;
