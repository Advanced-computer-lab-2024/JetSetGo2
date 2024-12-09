import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar, Nav, Container, Row, Col, Dropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Service method to fetch itineraries
const getItineraries = async () => {
  try {
    const response = await axios.get("http://localhost:8000/itinerary/getIteneraries");
    return response.data;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    throw error;
  }
};

// Service method to flag an itinerary
const flagItinerary = async (id) => {
  try {
    await axios.patch(`http://localhost:8000/itinerary/flag/${id}`);
  } catch (error) {
    console.error("Error flagging itinerary:", error);
  }
};

const ItinerariesAdmin = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const data = await getItineraries();
      setItineraries(data);
    } catch (error) {
      setError('Failed to load itineraries.');
    }
  };

  const handleFlagItinerary = async (id) => {
    try {
      await flagItinerary(id);
      fetchItineraries(); // Refresh list after flagging
    } catch (error) {
      setError('Error flagging itinerary.');
    }
  };

  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="admin-page">
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#">
            <img src={img1} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Dropdown alignRight>
                <Dropdown.Toggle className="drop">
                  <img src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg" alt="Profile" className="navbar-profile-image" />
                  Admin
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/notifications")}>Notifications</Dropdown.Item>

                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="admin-container">
        {/* Sidebar */}
        <div className="sidebar">
          <button className="sidebar-button" onClick={() => navigate("/adminCapabilities")}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </button>
          <button className="sidebar-button" onClick={() => navigate("/fetchdocuments")}>
            <i className="fas fa-users"></i> View Users
          </button>
          <button className="sidebar-button" onClick={() => navigate("/AddAdmin")}>
            <i className="fas fa-user-plus"></i> Add An Admin
          </button>
          <button className="sidebar-button" onClick={() => navigate("/DeleteUsers")}>
            <i className="fas fa-user-cog"></i> Manage Users
          </button>
          <button className="sidebar-button" onClick={() => navigate("/AddTourismGovernor")}>
            <i className="fas fa-user-tie"></i> Tourism Governer
          </button>
          
          <button className="sidebar-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar Image" className="sidebar-image" />
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          
          <h2 className="section-title">Available Itineraries</h2>

          {error && <p className="error">{error}</p>}

          {itineraries.length > 0 ? (
            <ul className="activity-list">
              {itineraries.map((itinerary) => {
                
                return (
                  <li key={itinerary._id} className="activity-item">
                    <div className="activity-details">
                    <p><strong>Tour Price:</strong> ${itinerary.TourPrice.join(", ")}</p>
              <p><strong>Duration of Activities:</strong> {itinerary.durationActivity.join(", ")} hours</p>
              <p><strong>Available Dates:</strong> {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")}</p>
              <p><strong>Tags:</strong> {Array.isArray(itinerary.Tags) ? itinerary.Tags.map(tag => tag.name).join(", ") : itinerary.Tags.name}</p>
              <p><strong>Rating:</strong> {itinerary.rating}</p>
 <button
                        className="flag-button"
                        onClick={() => handleFlagItinerary(itinerary._id)}
                        disabled={itinerary.flagged} // Disable button if already flagged
                      >
                        {itinerary.flagged ? "Unavailable" : "Flag as Unavailable"}
                      </button>
                    </div>
                    
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No Itineraries available.</p>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-buttons">
            <button className="box" onClick={() => navigate("/category")}>Categories</button>
            <button className="box" onClick={() => navigate("/TagsManagement")}>Tags</button>
            <button className="box" onClick={() => navigate("/product")}>Products</button>
            <button className="box" onClick={() => navigate("/activitiesAdmin")}>Activities</button>
            <button className="box" onClick={() => navigate("/ItinerariesAdmin")}>Itineraries</button>
            <button className="box" onClick={() => navigate("/MuseumsAdmin")}>Museums</button>
            <button className="box" onClick={() => navigate("/HistoricalPlacesAdmin")}>Historical Places</button>
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

export default ItinerariesAdmin;