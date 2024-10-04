import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const EditTourGuide = () => {
  const location = useLocation();
  const id = location.state?.id; // Safely retrieve ID from state

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Age: '',
    LanguagesSpoken: '',
    MobileNumber: '',
    YearsOfExperience: '',
    PreviousWork: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourGuide = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:8000/TourGuide/users/${id}`);
          setFormData(response.data);
        } catch (err) {
          console.error("Error fetching tour guide:", err);
          setError("Error fetching tour guide data.");
        }
      } else {
        setError("No Tour Guide ID provided.");
      }
    };

    fetchTourGuide();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/TourGuide/update/${id}`, formData);
      // Optionally navigate back or show a success message
    } catch (error) {
      console.error("Error updating tour guide:", error);
      setError("Error updating tour guide.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Tour Guide</h2>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>{key}:</label>
          <input 
            type="text" 
            name={key} 
            value={formData[key] || ''} // Ensure controlled input
            onChange={handleChange} 
            required 
          />
        </div>
      ))}
      <button type="submit">Update</button>
      <Link to={{ pathname: "/tour-guide", state: { id } }}>Cancel</Link> {/* Navigate back without showing ID */}
    </form>
  );
};

export default EditTourGuide;
