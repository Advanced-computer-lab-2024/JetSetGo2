import React, { useState, useEffect } from 'react';
import '../App.css'
import { getHistoricalPlace, createHistoricalPlace, updateHistoricalPlace, deleteHistoricalPlace } from '../services/HistoricalPlaceService';

const HistoricalplaceCRUD = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
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
    fetchHistoricalPlaces();
  }, []);

  // Fetch all activities
  const fetchHistoricalPlaces = async () => {
    try {
      const data = await getHistoricalPlace(); // Fetch activities from the backend
      setHistoricalPlaces(data);              // Update state with fetched data
    } catch (error) {
      console.error("Error fetching historicalPlaces", error);
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
      await createHistoricalPlace(formData);
      setMessage('HistoricalPlace created successfully!');
      resetCreateForm();
      fetchHistoricalPlaces(); // Fetch updated activities
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while creating the historicalPlace';
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
      await updateHistoricalPlace(editData._id, editData);
      setMessage('Historical Place updated successfully!');
      resetEditForm();
      fetchHistoricalPlaces(); // Fetch updated activities
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while updating the Historical Place.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  // Handle activity deletion
  const handleDelete = async (id) => {
    try {
      await deleteHistoricalPlace(id);
      setMessage('Historical Place deleted successfully!');
      fetchHistoricalPlaces(); // Fetch updated activities
    } catch (error) {
      setMessage('Error deleting Historical Place.');
      console.error(error);
    }
  };

  // Populate form with data for editing
  const handleEdit = (historicalPlace) => {
    setEditData(historicalPlace);
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
      <h1>Historical Places</h1>
  
      {/* Display success/error message */}
      {message && <p className="message">{message}</p>}
  
      {/* Form for creating a new historical place */}
      <section className="form-section">
        <h2>Create New Historical Place</h2>
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
          <button type="submit">Create Historical Place</button>
        </form>
      </section>
  
      {/* Form for editing an existing historical place */}
      {editData && (
        <section className="form-section">
          <h2>Edit Historical Place</h2>
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
            <button type="submit">Update Historical Place</button>
            <button type="button" onClick={resetEditForm}>Cancel Edit</button>
          </form>
        </section>
      )}
  
      {/* List of historical places */}
      <section className="historical-place-list">
        <h2>Historical Places List</h2>
        {historicalPlaces.length > 0 ? (
          <ul>
            {historicalPlaces.map((place) => (
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
          <p>No historical places found.</p>
        )}
      </section>
    </div>
  );
  
};

export default HistoricalplaceCRUD;
