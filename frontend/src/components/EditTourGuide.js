// src/components/EditTourGuide.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const EditTourGuide = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchTourGuide = async () => {
      const response = await axios.get(`http://localhost:8004/TourGuide/get/${id}`);
      setFormData(response.data);
    };
    fetchTourGuide();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8004/TourGuide/update', { id, ...formData });
      // You can add a success message or navigate here
    } catch (error) {
      console.error("Error updating tour guide:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Tour Guide</h2>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>{key}:</label>
          <input type="text" name={key} value={formData[key]} onChange={handleChange} required />
        </div>
      ))}
      <button type="submit">Update</button>
      <Link to={`/tour-guide/${id}`}>Cancel</Link>
    </form>
  );
};

export default EditTourGuide;
