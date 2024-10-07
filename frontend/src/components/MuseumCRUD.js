import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from "react-router-dom";
import {
  getMuseum,
  createMuseum,
  updateMuseum,
  deleteMuseum,
} from '../services/MuseumService';
import { getTourismGovernerTags,createTags, readGuide } from '../services/TourismGovernerTagService';

const MuseumCRUD = () => {
  const navigate = useNavigate();
  const [museums, setMuseums] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    pictures: '',
      location: '',
      openingHours: '',
      foreignerTicketPrice: '',
      nativeTicketPrice: '',
      studentTicketPrice: '',
  });
  const [editData, setEditData] = useState(null);
  const [tourismTags, setTourismTags] = useState([]);
  const [newTag, setNewTag] = useState({
    name: '',
    type: 'Monument',
    historicalPeriod: '',
    description: '', // Add description for the new tag
  });
  const [createdTagId, setCreatedTagId] = useState(null);
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
    fetchMuseums();
  }, []);

  const fetchMuseums = async () => {
    try {
      const data = await getMuseum();
      setMuseums(data);
      console.log('dataaa',data);
    } catch (error) {
      console.error('Error fetching Museums', error);
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
    if (!createdTagId) {
      setMessage('You must create a tag first before creating a museum.');
      return;
    }
    try {
      const newPlaceData = {
        ...formData,
        tourismGovernerTags: createdTagId, // Set the createdTagId to associate the tag
      };
      await createMuseum(newPlaceData);
      setMessage('Museum created successfully!');
      resetCreateForm();
      fetchMuseums();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : 'Error occurred while creating the Museum';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    try {
      await updateMuseum(editData._id, formData);
      setMessage('Museum updated successfully!');
      resetEditForm();
      fetchMuseums();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : 'Error occurred while updating the Museum.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMuseum(id);
      setMessage('Museum deleted successfully!');
      fetchMuseums();
    } catch (error) {
      setMessage('Error deleting Museum.');
      console.error(error);
    }
  };

  const handleEdit = (museum) => {
    setEditData(museum);
    setFormData({
      description: museum.description,
      pictures: museum.pictures,
      location: museum.location,
      openingHours: museum.openingHours,
      foreignerTicketPrice: museum.foreignerTicketPrice,
      nativeTicketPrice: museum.nativeTicketPrice,
      studentTicketPrice: museum.studentTicketPrice,
      
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
    if (!coordinates) {
      // Return a default map view or a blank one if no coordinates are provided
      return 'https://www.openstreetmap.org/export/embed.html?bbox=31.2357,30.0444,31.2557,30.0644&layer=mapnik'; // Cairo as a default location
    }
  
    const [long1, lat1] = coordinates.split(',').slice(0, 2);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  return (
    <div>
      <h1>Museums</h1>

      <button  onClick={() => navigate("/tourismGovernorPage")}>
          Tourism Governor Home
        </button>

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
        <h2>Create New museum</h2>
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
          <button type="submit">Create new museum</button>
        </form>
      </section>

      {editData && (
        <section className="form-section">
          <h2>Edit Museum</h2>
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
          
            <button type="submit">Update Museum</button>
          </form>
        </section>
      )}

      <h2>Existing Museums</h2>
      <ul>
        {museums.map((place) => (
          <li key={place._id}>
            <h3>Name: {place.tourismGovernerTags.name}</h3>
            <img src={place.pictures} alt={place.description} style={{ width: '100px', height: 'auto' }} />
            <p>Description: {place.description}</p>
            <p>Location: {place.location}</p>
            <p>Opening Hours: {place.openingHours}</p>
            <p>Foreigner Ticket Price: {place.foreignerTicketPrice}</p>
                <p>Native Ticket Price: {place.nativeTicketPrice}</p>
                <p>Student Ticket Price: {place.studentTicketPrice}</p>
                <p>Tags: {place.tourismGovernerTags?.type}</p>
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

export default MuseumCRUD;