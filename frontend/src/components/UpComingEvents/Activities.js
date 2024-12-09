import React, { useState, useEffect } from "react";
import axios from "axios";
import '../UpComingEvents/Activities.css';
import { getActivity, getCategories } from "../../services/ActivityService";
import { useNavigate, useLocation} from "react-router-dom"; // Import useNavigate
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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


const Activities = () => {
  const [activeTab, setActiveTab] = useState("filter");
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Added state for sort order
  const [sortBy, setSortBy] = useState("price"); // Added state for sorting by price or rating
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [error, setError] = useState(null);


  const [filters, setFilters] = useState({
    date: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });
  useEffect(() => {
    document.body.classList.add("Activities-body");
    return () => {
      document.body.classList.remove("Activities-body");
    };
  }, []);
  const navigate = useNavigate(); // Initialize useNavigate hook

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

  return (
    <div id="activities">
      {/* Navbar */}
      <Navbar className="navbar1">
        <Container>
          

          <Navbar.Brand href="#">
            <img src={img1} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <img
                src="/path-to-profile-image"
                alt="Profile"
                className="navbar1-profile-image"
                
              />
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  
      {/* Sidebar and Main Content */}
      <div className="Activity-container">
        {/* Sidebar */}
        <div className="sidebar">
          <button className="sidebar-button" onClick={() => navigate("/adminCapabilities")}>
          <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <button className="sidebar-button" onClick={() => navigate("/fetchdocuments")}>
          <i className="fas fa-chart-line"></i> Revenue Rep
          </button>
          <button className="sidebar-button" onClick={() => navigate("/AddAdmin")}>
          <i className="fas fa-user-times"></i> Delete Account
          </button>
          <button className="sidebar-button" onClick={() => navigate("/DeleteUsers")}>
          <i className="fas fa-arrow-left"></i> Back
          </button>
          
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
          </div>
        </div>
  
        {/* Main Content */}
        <div className="main-content">
         
          
  
          {/* Tabs for switching views */}
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "filter" ? "active" : ""}`}
              onClick={() => setActiveTab("filter")}
            >
              Filter Activities
            </button>
            <button
              className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Activities
            </button>
          </div>
  
          {/* Content based on active tab */}
          {activeTab === "filter" && (
            <section className="filter-section">
              
              <div className="filter-inputs">
                <div>
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                  />
                </div>
                <div>
                  <label>Category:</label>
                  <select
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
                  </select>
                </div>
                <div className="price-range">
                  <label>Price Range:</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min Price"
                  />
                  <span> - </span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max Price"
                  />
                </div>
                <div>
                  <label>Min Rating:</label>
                  <input
                    type="number"
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                    placeholder="Min Rating"
                  />
                </div>
                <div>
                  <label>Sort by:</label>
                  <select value={sortBy} onChange={handleSortByChange}>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <div>
                  <label>Sort Order:</label>
                  <select value={sortOrder} onChange={handleSortChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </section>
          )}
  
          {activeTab === "upcoming" && (
            <section className="activity-list">
              
              <div className="activity-grid">
                {filteredActivities.length > 0 ? (
                  <ul>
                    {filteredActivities.map((activity) => {
                      const locationCoords = activity.location.split(",");
                      const latitude = locationCoords[0];
                      const longitude = locationCoords[1];
                      const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;
  
                      return (
                        <li className="activity-card" key={activity._id}>
                          <div className="activity-card-header">
                            <h3>Category: {activity.category.name}</h3>
                          </div>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
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
                        <strong>Tags:</strong> {activity.tags ? activity.tags.name : "No Tags"}
                      </p>
                      <p>
                        <strong>Special Discount:</strong> {activity.specialDiscount}%
                      </p>
                      <p>
                        <strong>Booking Open:</strong> {activity.isBookingOpen ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Bookings:</strong> {activity.bookings}
                      </p>
                      <p>
                        <strong>Rating:</strong> {activity.rating}
                      </p>
                          <iframe
                            src={mapSrc}
                            width="300"
                            height="200"
                            style={{ border: "none" }}
                            title={`Map of ${activity.location}`}
                          ></iframe>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No upcoming activities available.</p>
                )}
              </div>
            </section>
          )}
        </div>
  
        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-buttons">
            <button className="box" onClick={() => navigate("/category")}>
              Create Activity
            </button>
           
          </div>
        </div>
      </div>
  
      {/* Footer */}
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

}

export default Activities;
