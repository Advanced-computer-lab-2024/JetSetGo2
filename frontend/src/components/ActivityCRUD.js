import React, { useState, useEffect } from "react";
import { useNavigate , Link} from 'react-router-dom';
import "../App.css";
import axios from "axios";

import {
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getCategories,
  getAdvertiser,
  getActivityById,
  getTags,
} from "../services/ActivityService";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import "../AdvertiserDetails.css"; // Import the updated styles
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 
import sidebarImage from './logoo444.JPG';
import 'bootstrap/dist/css/bootstrap.min.css';

// Fix marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ActivityCRUD = () => {
  const userId = localStorage.getItem("userId");
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "", // This will hold latitude and longitude as a string
    price: "",
    category: "",
    advertiser: userId,
    tags: "",
    specialDiscount: "",
    isBookingOpen: true,
    rating: 0,
    isActive : false ,
  });
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [searchLocation, setSearchLocation] = useState("");
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const adverId = localStorage.getItem("userId"); // Retrieve the Tour Guide ID from local storage

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchActivitiesByAdver();
  }, [userId]);

  const fetchActivitiesByAdver = async () => {
    try {
      const data = await getActivityById({ userId });
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setMessage("Failed to fetch activities.");
    }
  };

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

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleChange = (e, setData) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const locationString = `${pinPosition[0]},${pinPosition[1]}`; // Save lat, long as a string
    const newActivity = { ...formData, location: locationString };
    try {
      await createActivity(newActivity);
      setMessage("Activity created successfully!");
      resetCreateForm();
      fetchActivitiesByAdver();
    } catch (error) {
      setMessage("Error occurred while creating the activity.");
      console.error("Error:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    const locationString = `${pinPosition[0]},${pinPosition[1]}`; // Save lat, long as a string
    const updatedActivity = { ...formData, location: locationString };
    try {
      await updateActivity(editData._id, updatedActivity);
      setMessage("Activity updated successfully!");
      resetEditForm();
      fetchActivitiesByAdver();
    } catch (error) {
      setMessage("Error occurred while updating the activity.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      setMessage("Activity deleted successfully!");
      fetchActivitiesByAdver();
    } catch (error) {
      setMessage("Error deleting activity.");
      console.error(error);
    }
  };

  const handleEdit = (activity) => {
    setEditData(activity);
    setFormData({ ...activity });
    const [lat, lon] = activity.location.split(',').map(Number);
    setPinPosition([lat, lon]); // Set the map pin to the activity's location
  };
  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/home/adver/deletMyAccount/${adverId}`
        );

        if (response.status === 200) {
          alert(response.data.message); // Display success message
          navigate("/login"); // Redirect to homepage or login after deletion
        }
      } catch (error) {
        // Handle errors, such as when there are upcoming booked itineraries
        if (error.response && error.response.data.message) {
          alert(error.response.data.message); // Display error message from backend
        } else {
          alert("An error occurred while deleting the account.");
        }
      }
    }
  };
  const resetCreateForm = () => {
    setFormData({
      date: "",
      time: "",
      location: "",
      price: "",
      category: "",
      advertiser: userId,
      tags: "",
      specialDiscount: "",
      isBookingOpen: true,
      rating: 0,
      isActive : false ,
    });
    setPinPosition([30.0444, 31.2357]); // Reset map pin to default location (Cairo)
  };

  const resetEditForm = () => {
    setEditData(null);
    resetCreateForm();
  };

  const handleHomeNavigation = () => {
    navigate('/list'); // Adjust this path according to your routing setup
  };

  const handleRatingChange = (e) => {
    const value = Math.max(0, Math.min(5, Number(e.target.value)));
    setFormData((prev) => ({
      ...prev,
      rating: isNaN(value) ? 0 : value,
    }));
  };

  // Component for handling map clicks and updating the pin position
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPinPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return pinPosition ? <Marker position={pinPosition}></Marker> : null;
  };

  return (
    <div className="advertiser-page">
<Navbar className="advertiser-navbar">
        <Container>
          <Navbar.Brand href="#" className="advertiser-navbar-brand">
            <img src={img1} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Link to="/Upcoming-activities" className="nav-link">
              Activities
            </Link>
            <Link to="/Upcoming-itineraries" className="nav-link">
              Itineraries
            </Link>
            <Link to="/all-historicalplaces" className="nav-link">
              Historical Places
            </Link>
            <Link to="/all-museums" className="nav-link">
              Museums
            </Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="advertiser-container">
        {/* Left Sidebar */}
        <div className="advertiser-sidebar">
          <h3 className="sidebar-heading">Welcome</h3>
          <button onClick={() => navigate("/list")} className="sidebar-button">
            Home
          </button>
          <button onClick={handleLogout} className="sidebar-button">
            Logout
          </button>
          <button onClick={handleDeleteAccount} className="sidebar-button">
            Delete Account
          </button>
          <div className="advertiser-sidebar-image-container">
          <img src={sidebarImage} alt="Advertiser Sidebar" className="advertiser-sidebar-image" />
        </div>
  </div>
  <div className="advertiser-main-content">

      {message && <p className="message">{message}</p>}
  
      {/* Home Button */}
   
  
      {/* Form for creating a new activity */}
      <section className="form-section">
  <form onSubmit={handleCreateSubmit} className="modern-form">
    <div className="form-row">
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="input-field"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group full-width">
        <label>Location: (Click on the map to place the pin)</label>
        <input
          type="text"
          placeholder="Search location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="input-field"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="reply-button"
        >
          Search
        </button>
      </div>
    </div>
    <div className="map-container">
      <MapContainer
        center={pinPosition}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label>Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="input-field"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Tags:</label>
        <select
          name="tags"
          value={formData.tags}
          onChange={(e) => handleChange(e, setFormData)}
          required
          className="input-field"
        >
          <option value="">Select Tags</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Special Discount:</label>
        <input
          type="number"
          name="specialDiscount"
          value={formData.specialDiscount}
          onChange={(e) => handleChange(e, setFormData)}
          className="input-field"
        />
      </div>
    </div>

    <div className="form-row">
  <div className="form-group custom-checkbox-group">
    <input
      type="checkbox"
      name="isBookingOpen"
      id="isBookingOpen"
      checked={formData.isBookingOpen}
      onChange={(e) => handleChange(e, setFormData)}
      className="custom-checkbox"
    />
    <label htmlFor="isBookingOpen" className="custom-checkbox-label">
      Booking Open
    </label>
  </div>
  <div className="form-group custom-checkbox-group">
    <input
      type="checkbox"
      name="isActive"
      id="isActive"
      checked={formData.isActive}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
      }
      className="custom-checkbox"
    />
    <label htmlFor="isActive" className="custom-checkbox-label">
      Is Active
    </label>
</div>

      <div className="form-group">
        <label>Rating (0-5):</label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleRatingChange}
          className="input-field"
        />
      </div>
    </div>

  

    <button type="submit" className="reply-button">
      Create Activity
    </button>
  </form>
</section>

  
      {/* Form for editing an activity */}
      {editData && (
        <section className="form-section">
          <h2>Edit Activity</h2>
          <form onSubmit={handleEditSubmit}>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
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
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </label>
            <label>
              Category:
              <select
                name="category"
                value={formData.category}
                onChange={(e) => handleChange(e, setFormData)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tags:
              <select
                name="tags"
                value={formData.tags}
                onChange={(e) => handleChange(e, setFormData)}
                required
              >
                <option value="">Select Tags</option>
                {tags.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Special Discount:
              <input
                type="number"
                name="specialDiscount"
                value={formData.specialDiscount}
                onChange={(e) => handleChange(e, setFormData)}
              />
            </label>
            <label>
              Booking Open:
              <input
                type="checkbox"
                name="isBookingOpen"
                checked={formData.isBookingOpen}
                onChange={(e) => handleChange(e, setFormData)}
              />
            </label>
            <label>
              Rating (0-5):
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
              />
            </label>
            <label>
  <input
    type="checkbox"
    name="isActive"
    checked={formData.isActive}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
    }
    
  />
  Is Active
</label>

            <button type="submit">Update Activity</button>
          </form>
          <button onClick={resetEditForm}>Cancel Edit</button>
        </section>
      )}
  
      <section className="activity-list" style={{ marginTop: '20px' }}>
        <h2>Activity List</h2>
        {activities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activities.map((activity) => {
              const locationCoords = activity.location.split(",");
              const latitude = locationCoords[0];
              const longitude = locationCoords[1];
              const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;
  
              const category = categories.find(cat => cat._id === activity.category);
              const categoryName = category ? category.name : "Unknown Category";
  
              const tag = tags.find(t => t._id === activity.tags);
              const tagName = tag ? tag.name : "Unknown Tag";
  
              return (
                <div
                  key={activity._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                >
                  {/* Activity details */}
                  <div style={{ flex: 1, paddingRight: '20px' }}>
                    <h3 style={{ margin: '0 0 10px', fontSize: '1.5em', color: '#333' }}>
                      {categoryName}
                    </h3>
                    <h4>Advertiser: {activity.advertiser.UserName}</h4>
                    <p>Date: {activity.date}</p>
                    <p>Time: {activity.time}</p>
                    <p>Location: {activity.location}</p>
                    <p>Tags: {tagName}</p>
                    <p>Special Discount: {activity.specialDiscount}</p>
                    <p>Booking Open: {activity.isBookingOpen ? 'Yes' : 'No'}</p>
                    <p>Rating: {activity.rating}</p>
                    <p>Price: {activity.price} EGP</p>
                    <p>Active: {activity.isActive ? "Yes" : "No"}</p>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                      onClick={() => handleEdit(activity._id)}
                      className="reply-button"
                      >
                    
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activity._id)}
                      className="reply-button"
                      >
                    
                      Delete
                    </button>
                  </div>
                  </div>
                  {/* Edit and Delete buttons */}
                
                  <iframe
                    src={mapSrc}
                    width="250"
                    height="200"
                    style={{ border: 'none' }}
                    title={`Map of ${activity.location}`}
                  ></iframe>
                </div>
                
              );
            })}
          </div>
        ) : (
          <p>No activities found.</p>
        )}
      </section>
    </div>
    </div>
    <div className="footer">
        <Container>
          <Row>
            <Col md={4}>
              <h5>Contact Us</h5>
              <p>Email: contact@jetsetgo.com</p>
              <p>Phone: +123 456 7890</p>
            </Col>
            <Col md={4}>
              <h5>Address</h5>
              <p>123 Travel Road</p>
              <p>Adventure City, World 45678</p>
            </Col>
            <Col md={4}>
              <h5>Follow Us</h5>
              <p>Facebook | Twitter | Instagram</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
  
};

export default ActivityCRUD;
