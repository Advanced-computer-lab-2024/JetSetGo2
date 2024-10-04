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
    setLocation({ ...location, tags: e.target.value.split(',') });
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

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        placeholder="Name" 
        value={location.name} 
        onChange={handleChange} 
        required 
      />
      <select 
        name="type" 
        value={location.type} 
        onChange={handleChange} 
        required
      >
        <option value="">Select Type</option>
        <option value="Monument">Monument</option>
        <option value="Museum">Museum</option>
        <option value="Religious Site">Religious Site</option>
        <option value="Palace/Castle">Palace/Castle</option>
      </select>
      <input 
        type="text" 
        name="historicalPeriod" 
        placeholder="Historical Period" 
        value={location.historicalPeriod} 
        onChange={handleChange} 
        required 
      />
      <textarea 
        name="description" 
        placeholder="Description" 
        value={location.description} 
        onChange={handleChange}
      />
      <input 
        type="text" 
        name="tags" 
        placeholder="Tags (comma-separated)" 
        value={location.tags.join(',')} 
        onChange={handleTagsChange}
      />
      <button type="submit">Create Location</button>
    </form>
  );
};

export default LocationForm;
