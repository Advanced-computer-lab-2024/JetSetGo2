import React, { useState, useEffect } from 'react';
import '../App.css';
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

  // Fetch museums when the component mounts
  useEffect(() => {
    fetchMuseums();
  }, []);

  // Fetch all museums
  const fetchMuseums = async () => {
    try {
      const data = await getMuseum(); // Fetch museums from the backend
      setMuseums(data); // Update state with fetched data
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

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: selectedLocation,
    }));
  };

  // Handle form submission for creating a new museum
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMuseum(formData);
      setMessage('Museum created successfully!');
      resetCreateForm();
      fetchMuseums(); // Fetch updated museums
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while creating the museum';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  // Handle form submission for updating an existing museum
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return; // Return if there's no editData

    try {
      await updateMuseum(editData._id, formData);
      setMessage('Museum updated successfully!');
      resetEditForm();
      fetchMuseums(); // Fetch updated museums
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while updating the museum.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  // Handle museum deletion
  const handleDelete = async (id) => {
    try {
      await deleteMuseum(id);
      setMessage('Museum deleted successfully!');
      fetchMuseums(); // Fetch updated museums
    } catch (error) {
      setMessage('Error deleting museum.');
      console.error(error);
    }
  };

  // Populate form with data for editing
  const handleEdit = (museum) => {
    setEditData(museum);
    setFormData({ ...museum }); // Set formData to the museum being edited
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

  // Generate map source URL based on coordinates
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
      <h1>Museums</h1>

      {/* Display success/error message */}
      {message && <p className="message">{message}</p>}

      {/* Form for creating a new museum */}
      <section className="form-section">
        <h2>Create New Museum</h2>
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
          <button type="submit">Create Museum</button>
        </form>
      </section>

      {/* Form for editing an existing museum */}
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
            <button type="submit">Update Museum</button>
            <button type="button" onClick={resetEditForm}>Cancel Edit</button>
          </form>
        </section>
      )}

      {/* List of museums */}
      <section className="historical-place-list">
        <h2>Museums List</h2>
        {Museums.length > 0 ? (
          <ul>
            {Museums.map((museum) => {
              const locationData = predefinedLocations.find(
                (location) => location.name === museum.location
              );
              const mapSrc = locationData ? generateMapSrc(locationData.coordinates) : null;

              return (
                <li key={museum._id} className="historical-place-item">
                  <h3>{museum.description}</h3>
                  <img src={museum.pictures} alt={museum.description} style={{ maxWidth: '200px' }} />
                  <p>Location: {museum.location}</p>
                  <p>Opening Hours: {museum.openingHours}</p>
                  <p>Ticket Price: ${museum.ticketPrice}</p>
                  {mapSrc && (
                    <iframe
                      title={`Map for ${museum.location}`}
                      src={mapSrc}
                      width="300"
                      height="200"
                      style={{ border: 'none' }}
                    ></iframe>
                  )}
                  <div className="historical-place-actions">
                    <button onClick={() => handleEdit(museum)}>Edit</button>
                    <button onClick={() => handleDelete(museum._id)}>Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No museums found.</p>
        )}
      </section>
    </div>
  );
};

export default MuseumCRUD;
