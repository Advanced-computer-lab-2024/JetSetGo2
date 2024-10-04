import React, { useState, useEffect } from 'react';
import '../App.css'
import { getMuseum, createMuseum, updateMuseum, deleteMuseum } from '../services/MuseumService';

const MuseumCRUD = () => {
  const [Museums, setMuseums] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    pictures: '',
    location: '',
    openingHours: '',
    ticketPrice: ''
  });
  const [editData, setEditData] = useState(null);

  // Fetch activities when the component mounts
  useEffect(() => {
    fetchMuseums();
  }, []);

  // Fetch all activities
  const fetchMuseums = async () => {
    try {
      const data = await getMuseum(); // Fetch activities from the backend
      setMuseums(data);              // Update state with fetched data
    } catch (error) {
      console.error("Error fetching Museums", error);
    }
  };

  // Handle form input change
  const handleChange = (e, setData) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission for creating a new activity
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMuseum(formData);
      setMessage('Museum created successfully!');
      resetCreateForm();
      fetchMuseums(); // Fetch updated activities
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while creating the Museum';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  // Handle form submission for updating an existing activity
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return; // Return if there's no editData

    try {
      // Send the current state of editData with the ID
      await updateMuseum(editData._id, editData);
      setMessage('Museum updated successfully!');
      resetEditForm();
      fetchMuseums(); // Fetch updated activities
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while updating the Museum.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  // Handle activity deletion
  const handleDelete = async (id) => {
    try {
      await deleteMuseum(id);
      setMessage('Museum deleted successfully!');
      fetchMuseums(); // Fetch updated activities
    } catch (error) {
      setMessage('Error deleting Museum.');
      console.error(error);
    }
  };

  // Populate form with data for editing
  const handleEdit = (Museum) => {
    setEditData(Museum);
  };

  // Reset form for creating
  const resetCreateForm = () => {
    setFormData({
        description: '',
        pictures: '',
        location: '',
        openingHours: '',
        ticketPrice: ''
    });
  };

  // Reset form for editing
  const resetEditForm = () => {
    setEditData(null);
  };

  return (
    <div>
      <h1>Museums</h1>
  
      {/* Display success/error message */}
      {message && <p className="message">{message}</p>}
  
      {/* Form for creating a new Museum */}
      <section className="form-section">
        <h2>Create New Museum</h2>
        <form onSubmit={handleCreateSubmit}>
          <label>Description:
            <input type="text" name="description" value={formData.description} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Pictures (URL):
            <input type="text" name="pictures" value={formData.pictures} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Location:
            <input type="text" name="location" value={formData.location} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Opening Hours:
            <input type="text" name="openingHours" value={formData.openingHours} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Ticket Price:
            <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <button type="submit">Create Museum</button>
        </form>
      </section>
  
      {/* Form for editing an existing Museum */}
      {editData && (
        <section className="form-section">
          <h2>Edit Museum</h2>
          <form onSubmit={handleEditSubmit}>
            <label>Description:
              <input type="text" name="description" value={editData.description} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Pictures (URL):
              <input type="text" name="pictures" value={editData.pictures} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Location:
              <input type="text" name="location" value={editData.location} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Opening Hours:
              <input type="text" name="openingHours" value={editData.openingHours} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Ticket Price:
              <input type="number" name="ticketPrice" value={editData.ticketPrice} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <button type="submit">Update Museum</button>
            <button type="button" onClick={resetEditForm}>Cancel Edit</button>
          </form>
        </section>
      )}
  
      {/* List of Museums */}
      <section className="historical-place-list">
        <h2>Museums List</h2>
        {Museums.length > 0 ? (
          <ul>
            {Museums.map((place) => (
              <li key={place._id} className="historical-place-item">
                <h3>{place.description}</h3>
                <img src={place.pictures} alt={place.description} style={{ maxWidth: '200px' }} />
                <p>Location: {place.location}</p>
                <p>Opening Hours: {place.openingHours}</p>
                <p>Ticket Price: ${place.ticketPrice}</p>
                <div className="historical-place-actions">
                  <button onClick={() => handleEdit(place)}>Edit</button>
                  <button onClick={() => handleDelete(place._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Museums found.</p>
        )}
      </section>
    </div>
  );
  
};

export default MuseumCRUD;
