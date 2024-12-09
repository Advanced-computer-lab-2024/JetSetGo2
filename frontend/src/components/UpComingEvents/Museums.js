import React, { useState, useEffect } from "react";
import axios from "axios";
import { getMuseum } from "../../services/MuseumService"; // Update this path as needed
import { useNavigate ,Link} from "react-router-dom"; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from '../logoo444.JPG';
import "../TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from '../logoo4.JPG';
import { FaPen } from "react-icons/fa"; 

const predefinedLocations = [
  {
    name: "Cairo, Egypt",
    coordinates: "31.2357,30.0444,31.2557,30.0644",
  },
  {
    name: "Giza Pyramids, Egypt",
    coordinates: "31.1313,29.9765,31.1513,29.9965",
  },
  {
    name: "Alexandria, Egypt",
    coordinates: "29.9097,31.2156,29.9297,31.2356",
  },
  {
    name: "German University in Cairo, Egypt",
    coordinates: "31.4486,29.9869,31.4686,30.0069", // Sample bounding box
  },
  {
    name: "Cairo Festival City, Egypt",
    coordinates: "31.4015,30.0254,31.4215,30.0454", // Sample bounding box
  },
  // Add more locations as needed
];

const currencyRates = {
  EUR: 1,    // Base currency (assumed for conversion)
  USD: 1,  // Example conversion rate
  EGP: 30,   // Example conversion rate
};

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(""); // For storing selected tag
  const [filteredMuseums, setFilteredMuseums] = useState([]); // For storing filtered museums based on selected tag
  const [selectedCurrency, setSelectedCurrency] = useState("EGP"); // Default currency
  const userId = localStorage.getItem("userId"); // Retrieve the userId
  const [activeTab, setActiveTab] = useState("Details");



  // Fetch museums when the component mounts
  useEffect(() => {
    fetchMuseums();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      // Filter museums by the selected tag
      setFilteredMuseums(
        museums.filter(
          (museum) => museum.tourismGovernerTags?.type === selectedTag
        )
      );
    } else {
      // If no tag is selected, show all museums
      setFilteredMuseums(museums);
    }
  }, [selectedTag, museums]); // Trigger filtering when selectedTag or museums change

  const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchMuseums = async () => {
    try {
      const response = await axios.get("http://localhost:8000/museum/get");
      const data = response.data;
      const nonFlaggedMuseums = data.filter(place => !place.flagged);
      setMuseums(nonFlaggedMuseums);
      setFilteredMuseums(nonFlaggedMuseums);
      console.log("Museums:", nonFlaggedMuseums);
    } catch (error) {
      console.error("Error fetching Museums:", error);
      setError("Failed to load Museums.");
    }
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  const convertPrice = (price) => {
    return (price * currencyRates[selectedCurrency]).toFixed(2);
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

    <div id="museums" className="tour-guide-page">
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
  {/* Museums Tab */}
  <Tab eventKey="museums" title="Museums">
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
          <Form.Label className="filter-label">Filter by Tourism Governor Tag:</Form.Label>
          <Form.Select
            id="tagFilter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="filter-select"
          >
            <option value="">All Tags</option>
            {museums
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

      {/* Museum Cards */}
      {filteredMuseums.length > 0 ? (
        <div className="museum-cards-grid">
          {filteredMuseums.map((place) => {
            const locationCoords = place.location.split(",");
            const latitude = locationCoords[0];
            const longitude = locationCoords[1];
            const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

            return (
              <div key={place._id} className="museum-card">
                <div className="museum-card-header">
                  <h3 className="museum-title">{place.tourismGovernerTags?.name || "Unnamed"}</h3>
                  <p className="museum-location">{place.location}</p>
                </div>

                <div className="museum-card-body">
                  <p className="museum-description">{place.description}</p>
                  <div className="ticket-prices">
                    <p>
                      <strong>Foreigner:</strong> {convertPrice(place.foreignerTicketPrice)}{" "}
                      {selectedCurrency}
                    </p>
                    <p>
                      <strong>Student:</strong> {convertPrice(place.studentTicketPrice)}{" "}
                      {selectedCurrency}
                    </p>
                    <p>
                      <strong>Native:</strong> {convertPrice(place.nativeTicketPrice)}{" "}
                      {selectedCurrency}
                    </p>
                  </div>
                  <div className="museum-tags">
                    <strong>Tags:</strong>{" "}
                    {place.tourismGovernerTags?.type || "None"}
                  </div>
                </div>

                <div className="museum-card-image">
                  <img src={place.pictures} alt={`Picture of ${place.description}`} />
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
        <p className="no-data-message">No Museums available.</p>
      )}
    </div>
  </Tab>
</Tabs>


</div>
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



export default Museums;