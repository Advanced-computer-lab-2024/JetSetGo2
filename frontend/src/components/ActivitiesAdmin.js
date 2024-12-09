import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col, Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import '@fortawesome/fontawesome-free/css/all.min.css';

import axios from "axios";

// Service method to fetch activities
const getActivity = async () => {
  try {
    const response = await axios.get("http://localhost:8000/activity/get");
    return response.data;
  } catch (error) {
    console.error("Error fetching Activities:", error);
    throw error;
  }
};

// Service method to flag an activity
const flagActivity = async (id) => {
  try {
    await axios.patch(`http://localhost:8000/activity/flag/${id}`);
  } catch (error) {
    console.error("Error flagging activity:", error);
  }
};

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchActivities = async () => {
    try {
      const response = await getActivity();
      setActivities(response); // Store both flagged and unflagged activities
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to load activities.");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Handle flagging an activity
  const handleFlagActivity = async (id) => {
    await flagActivity(id);
    fetchActivities(); // Refresh list after flagging
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
          <button
            className="sidebar-button"
            onClick={() => navigate("/Sales-Report")}
          >
            <i className="fas fa-tachometer-alt"></i> Sales Report
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
          
          <h2 className="section-title">Available Activities</h2>

          {error && <p className="error">{error}</p>}

          {activities.length > 0 ? (
  <ul className="activity-list">
    {activities.map((activity) => {
      // Extract latitude and longitude from the activity location
      const locationCoords = activity.location.split(",");
      const latitude = locationCoords[0];
      const longitude = locationCoords[1];
      const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

      return (
        <li key={activity._id} className="activity-item">
          <div className="activity-details">
            <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {activity.time}</p>
            <p><strong>Price:</strong> ${activity.price}</p>
            <p><strong>Category:</strong> {activity.category?.name || "N/A"}</p>
            <p><strong>Tags:</strong> {activity.tags?.name || "N/A"}</p>
            <p><strong>Rating:</strong> {activity.rating}</p>
            <p><strong>Flagged:</strong> {activity.flagged ? "Yes" : "No"}</p>
            <button
              className="flag-button"
              onClick={() => handleFlagActivity(activity._id)}
              disabled={activity.flagged} // Disable button if already flagged
            >
              {activity.flagged ? "Unavailable" : "Flag as Unavailable"}
            </button>
          </div>
          <iframe
            src={mapSrc}
            width="250"
            height="200"
            style={{ border: 'none' }}
            title={`Map of ${activity.location}`}
            className="activity-map"
          ></iframe>
        </li>
      );
    })}
  </ul>
) : (
  <p>No Activities available.</p>
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

export default Activities;