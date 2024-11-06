import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from "react-router-dom";
import {
  getHistoricalPlace,
  createHistoricalPlace,
  updateHistoricalPlace,
  deleteHistoricalPlace,
} from '../services/HistoricalPlaceService';
import { getTourismGovernerTags, createTags,readGuide } from '../services/TourismGovernerTagService'; // Import the createTags function
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

// Fix marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HistoricalplaceCRUD = () => {
  const navigate = useNavigate();
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
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [searchLocation, setSearchLocation] = useState("");
  const [editData, setEditData] = useState(null);
  const [newTag, setNewTag] = useState({
    name: '',
    type: 'Monument',
    historicalPeriod: '',
    description: '', // Add description for the new tag
  });
  const [createdTagId, setCreatedTagId] = useState(null); // Store the newly created tag ID
  

  const handleSearch = () => {
    const geocoder = L.Control.Geocoder.nominatim();
    geocoder.geocode(searchLocation, (results) => {
      if (results && results.length > 0) {
        const { lat, lng } = results[0].center;
        setPinPosition([lat, lng]);
      } else {
        setMessage("Location not found.");
      }
    });
  };

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
    const locationString = `${pinPosition[0]},${pinPosition[1]}`; // Save lat, long as a string
    
    if (!createdTagId) {
      setMessage('You must create a tag first before creating a Historical place.');
      return;
    }
    try {
      // Associate the newly created tag with the historical place
      const newPlaceData = {
        ...formData,
        tourismGovernerTags: createdTagId,
        location: locationString , // Set the createdTagId to associate the tag
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
    const locationString = `${pinPosition[0]},${pinPosition[1]}`; // Save lat, long as a string
    const updatedHistoricalPlace = { ...formData, location: locationString };
    if (!editData) return;

    try {
      await updateHistoricalPlace(editData._id, updatedHistoricalPlace);
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
  
    // Logic to set the pin position on the map based on the location
    const [lat, lon] = historicalPlace.location.split(',').map(Number);
    setPinPosition([lat, lon]); // Set the map pin to the historical place's location
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
    setPinPosition([30.0444, 31.2357]);
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

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPinPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return pinPosition ? <Marker position={pinPosition}></Marker> : null;
  };
  return (
    <div>
      <h1>Historical Places</h1>
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
          {/* Map for selecting location */}
          <label>Location: (Click on the map to place the pin)</label>
          <input
            type="text"
            placeholder="Search location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>Search</button>
          <div style={{ height: "400px", width: "100%", marginBottom: "20px" }}>
            <MapContainer center={pinPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>
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
            {/* Map for editing location */}
            <label>Location: (Click on the map to change pin position)</label>
            <input
              type="text"
              placeholder="Search location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button type="button" onClick={handleSearch}>Search</button>
            <div style={{ height: "400px", width: "100%", marginBottom: "20px" }}>
              <MapContainer center={pinPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </div>
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
      {historicalPlaces.map((place) => {
        // Extract latitude and longitude from the location string
        const locationCoords = place.location.split(",");
        const latitude = locationCoords[0];
        const longitude = locationCoords[1];
        const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

        return (
          <li
            key={place._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            {/* Historical Place details */}
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.5em', color: '#333' }}>
                Name: {place.tourismGovernerTags.name}
              </h3>
              <img
                src={place.pictures}
                alt={place.description}
                style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
              />
              <p>Description: {place.description}</p>
              <p>Location: {place.location}</p>
              <p>Opening Hours: {place.openingHours}</p>
              <p>Foreigner Ticket Price: {place.foreignerTicketPrice}</p>
              <p>Native Ticket Price: {place.nativeTicketPrice}</p>
              <p>Student Ticket Price: {place.studentTicketPrice}</p>
              <p>Tags: {place.tourismGovernerTags?.type}</p>
            </div>
            {/* Edit and Delete buttons */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => handleEdit(place)}
                style={{ marginBottom: '10px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(place._id)}
                style={{ backgroundColor: 'red', color: '#fff' }}
              >
                Delete
              </button>
            </div>
            {/* Map iframe */}
            <iframe
              src={mapSrc}
              width="300"
              height="200"
              style={{ border: 'none' }}
              title={`Map of ${place.location}`}
            ></iframe>
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