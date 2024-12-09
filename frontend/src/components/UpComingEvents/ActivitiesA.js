import React, { useState, useEffect } from "react";
import axios from "axios";
import { getActivity, getCategories } from "../../services/ActivityService";
import { useNavigate,Link } from "react-router-dom"; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from '../logoo444.JPG';
import "../TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from '../logoo4.JPG';
import { FaPen } from "react-icons/fa"; 

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

const predefinedLocations = [
  { name: "Cairo, Egypt", coordinates: "31.2357,30.0444,31.2557,30.0644" },
  {
    name: "Giza Pyramids, Egypt",
    coordinates: "31.1313,29.9765,31.1513,29.9965",
  },
  { name: "Alexandria, Egypt", coordinates: "29.9097,31.2156,29.9297,31.2356" },
  {
    name: "German University in Cairo, Egypt",
    coordinates: "31.4486,29.9869,31.4686,30.0069",
  },
  {
    name: "Cairo Festival City, Egypt",
    coordinates: "31.4015,30.0254,31.4215,30.0454",
  },
];

const ActivitiesA = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Added state for sort order
  const [sortBy, setSortBy] = useState("price"); // Added state for sorting by price or rating
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");



  const [filters, setFilters] = useState({
    date: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate hook
  const userId = localStorage.getItem("userId"); // Retrieve the userId


  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activity/get");
      const data = response.data;
      const nonFlaggedActivities = data.filter(activity => !activity.flagged);
      setActivities(nonFlaggedActivities);
      setFilteredActivities(nonFlaggedActivities);
    } catch (error) {
      console.error("Error fetching Activities:", error);
      setError("Failed to load Activities.");
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

  const applyFilters = () => {
    let filtered = [...activities];

    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter(
        (activity) =>
          new Date(activity.date).toDateString() === filterDate.toDateString()
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (activity) => activity.category.name === filters.category
      );
    }

    // Apply price range filter
    if (filters.minPrice || filters.maxPrice) {
      const minPrice = parseFloat(filters.minPrice) || 0;
      const maxPrice = parseFloat(filters.maxPrice) || Infinity;
      filtered = filtered.filter(
        (activity) => activity.price >= minPrice && activity.price <= maxPrice
      );
    }

    // Apply rating filter
    if (filters.rating) {
      const ratingLimit = parseFloat(filters.rating);
      filtered = filtered.filter((activity) => activity.rating >= ratingLimit);
    }

    // Sort activities based on selected criteria (price or rating) and order
    filtered.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });

    setFilteredActivities(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [activities,filters, sortOrder, sortBy]); // Add sortOrder and sortBy to the dependency array

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value); // Update sort order state
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value); // Update sorting by price or rating
  };
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Example: remove token from localStorage
    navigate("/login"); // Redirect to the login page
  };
  const handleRevenuePage = () => {
    navigate("/revenue");
  };
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/TourGuide/deletMyAccount/${userId}`
        );

        if (response.status === 200) {
          alert(response.data.message); // Display success message
          navigate("/login"); // Redirect to homepage or login after deletion
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message); // Display error message from backend
        } else {
          alert("An error occurred while deleting the account.");
        }
      }
    }
  };
  const handleBackClick = () => {
    navigate(-1); // Navigate back
  };

  return (
    <div className="tour-guide-page">
      <Navbar className="navbar">
      <Container>
        
        <Navbar.Brand href="#" className="navbar-brand">
          {/* Replace with your logo */}
          <img src={img1} alt="Logo" className="navbar-logo" />
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Link to="/Upcoming-activities" className="nav-link">
            Activities
          </Link>
          <Link to="/Upcoming-itinerariestg" className="nav-link">
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
    <div className="admin-container">
    <div className="sidebar">
  <div className="profile-container">
    
    <button className="sidebar-button" onClick={handleLogout}>
      Logout
    </button>
    <button className="sidebar-button" onClick={handleRevenuePage} >
            Revenue Rep
          </button>
    <button onClick={handleDeleteAccount} className="sidebar-button">
      Delete Account
    </button>
    <button className="sidebar-button" onClick={handleBackClick}>
      Back
    </button>
  </div>
  <div className="sidebar-image-container">
    <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
  </div>
</div>
<div className="main-content">


<Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="tg">
      {/* Activities Tab */}
      <Tab eventKey="activities" title="Activities">
        <div className="activities-container">
          {/* Filter Section */}
          <div className="filters-container">
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price Range</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                  className="me-2"
                />
                <Form.Control
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Min Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                placeholder="Min Rating"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sort by</Form.Label>
              <Form.Select value={sortBy} onChange={handleSortByChange}>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sort Order</Form.Label>
              <Form.Select value={sortOrder} onChange={handleSortChange}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* View Activities Section */}
          <div className="activity-list">
            <h2 className="section-title">Upcoming Activities</h2>
            {filteredActivities.length > 0 ? (
              <ul className="activity-grid">
                {filteredActivities.map((activity) => {
                  const locationCoords = activity.location.split(",");
                  const latitude = locationCoords[0];
                  const longitude = locationCoords[1];
                  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

                  return (
                    <li key={activity._id} className="activity-card-modern">
                      <div className="activity-card-header">
                        <h3 className="activity-category">{activity.category.name}</h3>
                        <p className="activity-date">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="activity-card-body">
                        <div className="activity-info">
                          <p>
                            <strong>Time:</strong> {activity.time}
                          </p>
                          <p>
                            <strong>Location:</strong> {activity.location}
                          </p>
                          <p>
                            <strong>Price:</strong> ${activity.price}
                          </p>
                          <p>
                            <strong>Tags:</strong>{" "}
                            {activity.tags?.name || "No Tags"}
                          </p>
                          <p>
                            <strong>Special Discount:</strong>{" "}
                            {activity.specialDiscount}%
                          </p>
                          <p>
                            <strong>Booking Open:</strong>{" "}
                            {activity.isBookingOpen ? "Yes" : "No"}
                          </p>
                          <p>
                            <strong>Bookings:</strong> {activity.bookings}
                          </p>
                          <p>
                            <strong>Rating:</strong> {activity.rating}
                          </p>
                        </div>
                      </div>

                      <div className="activity-card-footer">
                        <iframe
                          src={mapSrc}
                          width="100%"
                          height="200"
                          className="activity-map"
                          title={`Map of ${activity.location}`}
                          loading="lazy"
                        ></iframe>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No upcoming activities available.</p>
            )}
          </div>
        </div>
      </Tab>
    </Tabs>


    </div>
    {/* Right Sidebar */}
<div className="right-sidebar">
  <div className="sidebar-buttons">
    <button className="box" onClick={() => navigate("/SchemaTourFront")}>Create Itinerary</button>
  </div>
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

export default ActivitiesA;
