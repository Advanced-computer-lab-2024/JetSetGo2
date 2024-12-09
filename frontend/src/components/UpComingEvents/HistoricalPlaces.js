import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link} from "react-router-dom"; // Import useNavigate
import { getHistoricalPlace } from "../../services/HistoricalPlaceService"; // Update this path as needed
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
const currencyRates = {
  EUR: 1,    // Base currency (assumed for conversion)
  USD: 1,  // Example conversion rate
  EGP: 30,   // Example conversion rate
};

const HistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]);

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCurrency, setSelectedCurrency] = useState("EGP"); // Default currency

  // Fetch historical places
  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  const fetchHistoricalPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:8000/historicalPlace/get");
      const data = response.data;
      const nonFlaggedHistoricalPlaces = data.filter(place => !place.flagged);
      setHistoricalPlaces(nonFlaggedHistoricalPlaces);
      setFilteredPlaces(nonFlaggedHistoricalPlaces);
    } catch (error) {
      console.error("Error fetching HistoricalPlaces:", error);
      setError("Failed to load HistoricalPlaces.");
    }
  };

  const handleView = (place) => {
    navigate(`/HP/${place.id}, { state: { place } }`);
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };
  const convertPrice = (price) => {
    return (price * currencyRates[selectedCurrency]).toFixed(2);
  };
  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };
  const handleBackClick = () => {
    navigate(-1); // Navigate back
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
    <div id="historicalPlaces" className="tour-guide-page">
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#" className="navbar-brand">
            <img src={img1} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
          <Nav className="ml-auto">
           
          </Nav>
        </Container>
      </Navbar>

      <div className="admin-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="profile-container">
          
          <button className="sidebar-button" onClick={handleLogout}>
      Logout
    </button>
    
   
    <button className="sidebar-button" onClick={handleBackClick}>
      Back
    </button>
          </div>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Tabs defaultActiveKey="historicalPlaces" className="tg">
            <Tab eventKey="historicalPlaces" title="Historical Places">
              <div className="museums-container">
                {error && <p className="error-message">{error}</p>}

                {/* Filters */}
                <div className="filters-container">
                  <div className="filter-group">
                    <Form.Label className="filter-label">Choose Currency:</Form.Label>
                    <Form.Select
                      id="currencySelect"
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="filter-select"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="EGP">EGP</option>
                    </Form.Select>
                  </div>

                  <div className="filter-group">
                    <Form.Label className="filter-label">Filter by Tag:</Form.Label>
                    <Form.Select
                      id="tagFilter"
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Tags</option>
                      {historicalPlaces
                        .map((place) => place.tourismGovernerTags?.type)
                        .filter((value, index, self) => value && self.indexOf(value) === index)
                        .map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                    </Form.Select>
                  </div>
                </div>

                {/* Historical Place Cards */}
                {filteredPlaces.length > 0 ? (
                  <div className="museum-cards-grid">
                    {filteredPlaces.map((place) => {
                      const locationCoords = place.location.split(",");
                      const latitude = locationCoords[0];
                      const longitude = locationCoords[1];
                      const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

                      return (
                        <div key={place._id} className="museum-card">
                          <div className="museum-card-header">
                            <h3 className="museum-title">
                              {place.tourismGovernerTags?.name || "Unnamed"}
                            </h3>
                            <p className="museum-location">{place.location}</p>
                          </div>

                          <div className="museum-card-body">
                            <p className="museum-description">{place.description}</p>
                            <div className="ticket-prices">
                              <p>
                                <strong>Foreigner:</strong>{" "}
                                {convertPrice(place.foreignerTicketPrice)} {selectedCurrency}
                              </p>
                              <p>
                                <strong>Student:</strong>{" "}
                                {convertPrice(place.studentTicketPrice)} {selectedCurrency}
                              </p>
                              <p>
                                <strong>Native:</strong>{" "}
                                {convertPrice(place.nativeTicketPrice)} {selectedCurrency}
                              </p>
                            </div>
                          </div>

                          <div className="museum-card-image">
                            <img
                              src={place.pictures}
                              alt={`Picture of ${place.description}`}
                            />
                          </div>

                          {mapSrc && (
                            <iframe
                              title={`Map for ${place.location}`}
                              src={mapSrc}
                              className="museum-map"
                            ></iframe>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-data-message">No Historical Places available.</p>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-buttons">
            
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
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  filterContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  filterLabel: {
    marginRight: "10px",
    fontSize: "1rem",
    color: "#555",
  },
  filterSelect: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    maxWidth: "300px",
    width: "100%",
    transition: "transform 0.2s",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.5rem",
    color: "#444",
    marginBottom: "10px",
  },
  cardText: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "10px",
  },
  cardImageContainer: {
    height: "150px",
    marginBottom: "10px",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
  },
  map: {
    marginTop: "15px",
    borderRadius: "5px",
  },
  noDataMessage: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#888",
  },
};

export default HistoricalPlaces;