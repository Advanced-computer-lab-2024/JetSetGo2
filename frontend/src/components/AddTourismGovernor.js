import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTourismGovernor, deleteTourismGovernor } from '../services/TourismService';
import { Navbar, Nav, Container, Row, Col, Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TourismGovernorComponent = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [governors, setGovernors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const governorData = { username, password };
      const response = await createTourismGovernor(governorData);
      setMessage('Tourism Governor created successfully!');
      setUsername('');
      setPassword('');
      fetchGovernors(); // Refresh the list of governors after adding a new one
    } catch (error) {
      setMessage('Error creating Tourism Governor. Please try again.');
      console.error("Error creating Tourism Governor:", error);
    }
  };

  // Fetch all tourism governors from the backend
  const fetchGovernors = async () => {
    try {
      const response = await fetch('http://localhost:8000/tourism/get');
      const data = await response.json();
      setGovernors(data);
    } catch (error) {
      console.error("Error fetching Tourism Governors:", error);
      //setMessage('Error fetching Tourism Governor list.');
    }
  };

  // Handle deletion of a tourism governor
  const handleDelete = async (id) => {
    try {
      await deleteTourismGovernor(id);
      setMessage('Tourism Governor deleted successfully!');
      fetchGovernors(); // Refresh the list after deletion
    } catch (error) {
      setMessage('Error deleting Tourism Governor. Please try again.');
      console.error("Error deleting Tourism Governor:", error);
    }
  };

  useEffect(() => {
    fetchGovernors();
  }, []);

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
          <h2 className="section-title">Add Tourism Governor</h2>
          <Form onSubmit={handleSubmit} className="admin-form">
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </Form.Group>
            <Button className="addadmin-button" type="submit">
              Add Governor
            </Button>
          </Form>
          {message && <div className="alert alert-success">{message}</div>}

          <h2 className="section-title">Tourism Governors List</h2>
          <ul className="admin-list">
            {governors.map((governor) => (
              <li key={governor._id} className="admin-list-item">
                {governor.username}
                <button
                  onClick={() => handleDelete(governor._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
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

export default TourismGovernorComponent;