import React, { useState } from 'react';
import axios from 'axios';

const LocationForm = () => {
  const [location, setLocation] = useState({
    name: '',
    type: '',
    historicalPeriod: '',
    description: '',
    tags: []
  });

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (e) => {
    setLocation({ ...location, tags: e.target.value.split(',').map(tag => tag.trim()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8004/TourismTags/add', location);
      console.log('Location created:', response.data);
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  // Inline style definitions
  const containerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    height: '100px',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#45a049',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Create New Location</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label htmlFor="name" style={labelStyle}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter the location name"
            value={location.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="type" style={labelStyle}>Type:</label>
          <select
            id="type"
            name="type"
            value={location.type}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Select Type</option>
            <option value="Monument">Monument</option>
            <option value="Museum">Museum</option>
            <option value="Religious Site">Religious Site</option>
            <option value="Palace/Castle">Palace/Castle</option>
          </select>
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="historicalPeriod" style={labelStyle}>Historical Period:</label>
          <input
            type="text"
            id="historicalPeriod"
            name="historicalPeriod"
            placeholder="Enter the historical period"
            value={location.historicalPeriod}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="description" style={labelStyle}>Description:</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter a brief description"
            value={location.description}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="tags" style={labelStyle}>Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="Enter relevant tags"
            value={location.tags.join(',')}
            onChange={handleTagsChange}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
        >
          Create Location
        </button>
      </form>
    </div>
  );
};

export default LocationForm;
