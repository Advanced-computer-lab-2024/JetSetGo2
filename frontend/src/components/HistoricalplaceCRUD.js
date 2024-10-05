import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  getHistoricalPlace,
  createHistoricalPlace,
  updateHistoricalPlace,
  deleteHistoricalPlace,
} from '../services/HistoricalPlaceService';
import { getTourismGovernerTags, readGuide } from '../services/TourismGovernerTagService'; // Import service for fetching tags

const HistoricalplaceCRUD = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    pictures: '',
    location: '',
    openingHours: '',
    ticketPrice: '',
    tourismGovernerTags: '',
  });
  const [editData, setEditData] = useState(null);
  const [tourismTags, setTourismTags] = useState([]);

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
  ];

  useEffect(() => {
    fetchHistoricalPlaces();
    fetchTourismTags();
  }, []);

  const fetchHistoricalPlaces = async () => {
    try {
      const data = await getHistoricalPlace();
      setHistoricalPlaces(data);
    } catch (error) {
      console.error('Error fetching historicalPlaces', error);
    }
  };

  const fetchTourismTags = async () => {
    try {
      const tags = await readGuide();
      setTourismTags(tags);
    } catch (error) {
      console.error('Error fetching tourism tags', error);
    }
  };

  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: selectedLocation,
    }));
  };

  const handleTourismTagChange = (e) => {
    const selectedTagId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      tourismGovernerTags: selectedTagId,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHistoricalPlace(formData);
      setMessage('Historical Place created successfully!');
      resetCreateForm();
      fetchHistoricalPlaces();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : 'Error occurred while creating the historical place';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    try {
      await updateHistoricalPlace(editData._id, formData);
      setMessage('Historical Place updated successfully!');
      resetEditForm();
      fetchHistoricalPlaces();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : 'Error occurred while updating the Historical Place.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoricalPlace(id);
      setMessage('Historical Place deleted successfully!');
      fetchHistoricalPlaces();
    } catch (error) {
      setMessage('Error deleting Historical Place.');
      console.error(error);
    }
  };

  const handleEdit = (historicalPlace) => {
    setEditData(historicalPlace);
    setFormData({
      description: historicalPlace.description,
      pictures: historicalPlace.pictures,
      location: historicalPlace.location,
      openingHours: historicalPlace.openingHours,
      ticketPrice: historicalPlace.ticketPrice,
      tourismGovernerTags: historicalPlace.tourismGovernerTags?._id || '',
    });
  };

  const resetCreateForm = () => {
    setFormData({
      description: '',
      pictures: '',
      location: '',
      openingHours: '',
      ticketPrice: '',
      tourismGovernerTags: '',
    });
  };

  const resetEditForm = () => {
    setEditData(null);
    resetCreateForm();
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1] = coordinates.split(',').slice(0, 2);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  return (
    <div>
      <h1>Historical Places</h1>

      {message && <p className="message">{message}</p>}

      <section className="form-section">
        <h2>Create New Historical Place</h2>
        <form onSubmit={handleCreateSubmit}>
          <label>
            Description:
            <input type="text" name="description" value={formData.description} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>
            Pictures (URL):
            <input type="text" name="pictures" value={formData.pictures} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>
            Location:
            <select name="location" value={formData.location} onChange={handleLocationChange} required>
              <option value="">Select Location</option>
              {predefinedLocations.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Opening Hours:
            <input type="text" name="openingHours" value={formData.openingHours} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>
            Ticket Price:
            <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>
            Tourism Governor Tags:
            <select name="tourismGovernerTags" value={formData.tourismGovernerTags} onChange={handleTourismTagChange} required>
              <option value="">Select Tag</option>
              {tourismTags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Create Historical Place</button>
        </form>
      </section>

      {editData && (
        <section className="form-section">
          <h2>Edit Historical Place</h2>
          <form onSubmit={handleEditSubmit}>
            <label>
              Description:
              <input type="text" name="description" value={formData.description} onChange={(e) => handleChange(e, setFormData)} required />
            </label>
            <label>
              Pictures (URL):
              <input type="text" name="pictures" value={formData.pictures} onChange={(e) => handleChange(e, setFormData)} required />
            </label>
            <label>
              Location:
              <select name="location" value={formData.location} onChange={handleLocationChange} required>
                <option value="">Select Location</option>
                {predefinedLocations.map((location) => (
                  <option key={location.name} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Opening Hours:
              <input type="text" name="openingHours" value={formData.openingHours} onChange={(e) => handleChange(e, setFormData)} required />
            </label>
            <label>
              Ticket Price:
              <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={(e) => handleChange(e, setFormData)} required />
            </label>
            <label>
              Tourism Governor Tags:
              <select name="tourismGovernerTags" value={formData.tourismGovernerTags} onChange={handleTourismTagChange} required>
                <option value="">Select Tag</option>
                {tourismTags.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Update Historical Place</button>
          </form>
        </section>
      )}

      <h2>Existing Historical Places</h2>
      <ul>
        {historicalPlaces.map((place) => (
          <li key={place._id}>
            <h3>{place.description}</h3>
            <p>Location: {place.location}</p>
            <p>Opening Hours: {place.openingHours}</p>
            <p>Ticket Price: {place.ticketPrice}</p>
            <p>Tourism Governor Tags: {place.tourismGovernerTags?.name || 'None'}</p>
            <iframe
              title="Location Map"
              width="300"
              height="200"
              src={generateMapSrc(predefinedLocations.find(loc => loc.name === place.location)?.coordinates)}
            ></iframe>
            <button onClick={() => handleEdit(place)}>Edit</button>
            <button onClick={() => handleDelete(place._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoricalplaceCRUD;
