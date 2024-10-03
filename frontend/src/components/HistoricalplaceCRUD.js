import React, { useState, useEffect } from 'react';
import '../App.css';
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

  const predefinedLocations = [
    {
      name: 'Cairo, Egypt',
      coordinates: '31.2357,30.0444,31.2557,30.0644',
    },
    {
      name: 'Giza Pyramids, Egypt',
      coordinates: '31.1313,29.9765,31.1513,29.9965',
    },
    {
      name: 'Alexandria, Egypt',
      coordinates: '29.9097,31.2156,29.9297,31.2356',
    },
    // Add more locations as needed
  ];

  // Fetch historical places when the component mounts
  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  // Fetch all historical places
  const fetchHistoricalPlaces = async () => {
    try {
      const data = await getHistoricalPlace(); // Fetch historical places from the backend
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

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: selectedLocation,
    }));
  };

  // Handle form submission for creating a new historical place
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHistoricalPlace(formData);
      setMessage('Historical Place created successfully!');
      resetCreateForm();
      fetchHistoricalPlaces(); // Fetch updated historical places
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while creating the historical place';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  // Handle form submission for updating an existing historical place
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return; // Return if there's no editData

    try {
      // Send the current state of editData with the ID
      await updateHistoricalPlace(editData._id, formData);
      setMessage('Historical Place updated successfully!');
      resetEditForm();
      fetchHistoricalPlaces(); // Fetch updated historical places
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while updating the Historical Place.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  // Handle historical place deletion
  const handleDelete = async (id) => {
    try {
      await deleteHistoricalPlace(id);
      setMessage('Historical Place deleted successfully!');
      fetchHistoricalPlaces(); // Fetch updated historical places
    } catch (error) {
      setMessage('Error deleting Historical Place.');
      console.error(error);
    }
  };

  // Populate form with data for editing
  const handleEdit = (historicalPlace) => {
    setEditData(historicalPlace);
    setFormData({ ...historicalPlace }); // Set formData to the historical place being edited
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

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(',');
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  // Reset form for editing
  const resetEditForm = () => {
    setEditData(null);
    resetCreateForm(); // Reset formData on edit reset
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
          <label>
            Location:
            <select
              name="location"
              value={formData.location}
              onChange={handleLocationChange}
              required
            >
              <option value="">Select Location</option>
              {predefinedLocations.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
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
            <label>
              Location:
              <select
                name="location"
                value={editData.location}
                onChange={handleLocationChange}
                required
              >
                <option value="">Select Location</option>
                {predefinedLocations.map((location) => (
                  <option key={location.name} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
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
            {historicalPlaces.map((place) => {
              const locationData = predefinedLocations.find(
                (location) => location.name === place.location
              );
              const mapSrc = locationData ? generateMapSrc(locationData.coordinates) : null;

              return (
                <li key={place._id} className="historical-place-item">
                  <h3>{place.description}</h3>
                  <img src={place.pictures} alt={place.description} style={{ maxWidth: '200px' }} />
                  <p>Location: {place.location}</p>
                  <p>Opening Hours: {place.openingHours}</p>
                  <p>Ticket Price: ${place.ticketPrice}</p>
                  {mapSrc && (
                    <iframe
                      title={`Map for ${place.location}`}
                      src={mapSrc}
                      width="300"
                      height="200"
                      style={{ border: 'none' }}
                    ></iframe>
                  )}
                  <button onClick={() => handleEdit(place)}>Edit</button>
                  <button onClick={() => handleDelete(place._id)}>Delete</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No historical places found.</p>
        )}
      </section>
    </div>
  );
};

export default HistoricalplaceCRUD;
