import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  getHistoricalPlace,
  createHistoricalPlace,
  updateHistoricalPlace,
  deleteHistoricalPlace,
} from '../services/HistoricalPlaceService';
import { getTourismGovernerTags, createTags,readGuide } from '../services/TourismGovernerTagService'; // Import the createTags function

const HistoricalplaceCRUD = () => {
  const [tourismTags, setTourismTags] = useState([]);
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    description: '',
      pictures: '',
      location: '',
      openingHours: '',
      foreignerTicketPrice: '',
      nativeTicketPrice: '',
      studentTicketPrice: '',
  });
  const [editData, setEditData] = useState(null);
  const [newTag, setNewTag] = useState({
    name: '',
    type: 'Monument',
    historicalPeriod: '',
    description: '', // Add description for the new tag
  });
  const [createdTagId, setCreatedTagId] = useState(null); // Store the newly created tag ID

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
      console.log('Fetched Tourism Tags:', tags); // Debugging: check if tags are fetched
      setTourismTags(tags);
      console.log(tourismTags)
    } catch (error) {
      console.error('Error fetching tourism tags', error);
    }
  };
  const handleTourismTagChange = (e) => {
    const selectedTagId = e.target.value;
    console.log('Selected Tag ID:', selectedTagId); // Debugging: check the selected tag ID
    setFormData((prev) => ({
      ...prev,
      tourismGovernerTags: selectedTagId, // Set the ID of the selected tag
    }));
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createdTagId) {
      setMessage('You must create a tag first before creating a Historical place.');
      return;
    }
    try {
      // Associate the newly created tag with the historical place
      const newPlaceData = {
        ...formData,
        tourismGovernerTags: createdTagId, // Set the createdTagId to associate the tag
      };
      await createHistoricalPlace(newPlaceData);
      setMessage('Historical Place created successfully!');
      resetCreateForm();
      fetchHistoricalPlaces();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : 'Error occurred while creating the historical place';
      setMessage(errorMessage);
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
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoricalPlace(id);
      setMessage('Historical Place deleted successfully!');
      fetchHistoricalPlaces();
    } catch (error) {
      setMessage('Error deleting Historical Place.');
    }
  };

  const handleEdit = (historicalPlace) => {
    setEditData(historicalPlace);
    setFormData({
      description: historicalPlace.description,
      pictures: historicalPlace.pictures,
      location: historicalPlace.location,
      openingHours: historicalPlace.openingHours,
      foreignerTicketPrice: historicalPlace.foreignerTicketPrice,
      nativeTicketPrice: historicalPlace.nativeTicketPrice,
      studentTicketPrice: historicalPlace.studentTicketPrice,
    });
  };

  const resetCreateForm = () => {
    setFormData({
      description: '',
      pictures: '',
      location: '',
      openingHours: '',
      foreignerTicketPrice: '',
      nativeTicketPrice: '',
      studentTicketPrice: '',
    });
    setCreatedTagId(null); // Reset created tag ID
  };

  const resetEditForm = () => {
    setEditData(null);
    resetCreateForm();
  };

  const handleTagCreate = async (e) => {
    e.preventDefault();
    try {
      const createdTag = await createTags(newTag); // Create the tag
      setCreatedTagId(createdTag._id); // Set the newly created tag ID
      setNewTag({
        name: '',
        type: 'Monument',
        historicalPeriod: '',
        description: '', // Reset the description field
      });
      setMessage('Tag created successfully!');
    } catch (error) {
      console.error('Error creating tag:', error);
      setMessage('Error creating tag');
    }
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
        <h2>Create New Tourism Tag</h2>
        <form onSubmit={handleTagCreate}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newTag.name}
              onChange={(e) => handleChange(e, setNewTag)}
              required
            />
          </label>
          <label>
            Type:
            <select
              name="type"
              value={newTag.type}
              onChange={(e) => handleChange(e, setNewTag)}
              required
            >
              <option value="Monument">Monument</option>
              <option value="Museum">Museum</option>
              <option value="Religious Site">Religious Site</option>
              <option value="Palace/Castle">Palace/Castle</option>
            </select>
          </label>
          <label>
            Historical Period:
            <input
              type="text"
              name="historicalPeriod"
              value={newTag.historicalPeriod}
              onChange={(e) => handleChange(e, setNewTag)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={newTag.description}
              onChange={(e) => handleChange(e, setNewTag)}
              required
            />
          </label>
          <button type="submit">Create Tag</button>
        </form>
        </section>
      <section className="form-section">
        <h2>Create New Historical Place</h2>
        <form onSubmit={handleCreateSubmit}>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </label>
          <label>
            Pictures (URL):
            <input
              type="text"
              name="pictures"
              value={formData.pictures}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
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
          <label>
            Opening Hours:
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </label>
          <label>
            Foreigner Ticket Price:
            <input
              type="number"
              name="foreignerTicketPrice"
              value={formData.foreignerTicketPrice}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </label>
          <label>
            Native Ticket Price:
            <input
              type="number"
              name="nativeTicketPrice"
              value={formData.nativeTicketPrice}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </label>
          <label>
            Student Ticket Price:
            <input
              type="number"
              name="studentTicketPrice"
              value={formData.studentTicketPrice}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
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
              Foreigner Ticket Price:
              <input type="number" name="foreignerTicketPrice" value={formData.foreignerTicketPrice} onChange={(e) => handleChange(e, setFormData)} required />
            </label>
            <label>
              Native Ticket Price:
              <input type="number" name="nativeTicketPrice" value={formData.nativeTicketPrice} onChange={(e) => handleChange(e, setFormData)} required />
            </label>
            <label>
              Student Ticket Price:
              <input type="number" name="studentTicketPrice" value={formData.studentTicketPrice} onChange={(e) => handleChange(e, setFormData)} required />
            </label>
        
            <button type="submit">Update Historical Place</button>
          </form>
        </section>
      )}

      

     
    

      <section className="historical-places">
        <h2>Historical Places List</h2>
        {historicalPlaces.length > 0 ? (
          <ul>
            {historicalPlaces.map((place) => (
              <li key={place._id}>
               <h3>{place.tourismGovernerTags.name}</h3>
               <p>Description: {place.description}</p>
               <p>Location: {place.location}</p>
               <p>Opening Hours: {place.openingHours}</p>
                <p>Foreigner Ticket Price: {place.foreignerTicketPrice}</p>
                <p>Native Ticket Price: {place.nativeTicketPrice}</p>
                <p>Student Ticket Price: {place.studentTicketPrice}</p>
                <p>Tags: {place.tourismGovernerTags?.type}</p>
                <button onClick={() => handleEdit(place)}>Edit</button>
                <button onClick={() => handleDelete(place._id)}>Delete</button>
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