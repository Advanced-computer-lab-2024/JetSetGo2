import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from 'react-router-dom';

import "../AdvertiserDetails.css"; // Import the updated styles
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 
import sidebarImage from './logoo444.JPG';
import 'bootstrap/dist/css/bootstrap.min.css';

const TransportationPage = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    startLocation: "",
    endLocation: "",
    price: "",
    vehicleType: "",
    seatsAvailable: "",
    driverName: "",
  });
  const [transportations, setTransportations] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const API_URL = "http://localhost:8000";
  const navigate = useNavigate();
  const adverId = localStorage.getItem("userId"); // Retrieve the Tour Guide ID from local storage

  // Fetch all transportations on component mount
  useEffect(() => {
    fetchTransportations();
  }, []);

  const fetchTransportations = async () => {
    try {
      const response = await axios.get(`${API_URL}/transportation/get`);
      setTransportations(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching transportations:", error);
      setError("Failed to fetch transportations. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleHomeNavigation = () => {
    navigate('/list'); // Adjust this path according to your routing setup
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId"); // Fetch advertiser ID from localStorage
    if (!userId) {
      setError("User ID not found in local storage. Please log in.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/transportation/add`, {
        ...formData,
        advertiser: userId, // Automatically set advertiser field
      });
      setTransportations((prevData) => [...prevData, response.data]);
      setFormData({
        date: "",
        time: "",
        startLocation: "",
        endLocation: "",
        price: "",
        vehicleType: "",
        seatsAvailable: "",
        driverName: "",

      });
      setSuccessMessage("Transportation created successfully!");

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error creating transportation:", error);
      setError("Failed to create transportation. Please try again.");
    }
  };

  return (
    <div className="advertiser-page">
      {/* Navbar */}
      <Navbar className="advertiser-navbar">
        <Container>
          <Navbar.Brand href="#" className="advertiser-navbar-brand">
            <img src={img1} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="/Upcoming-activities" className="nav-link">
              Activities
            </Nav.Link>
            <Nav.Link href="/Upcoming-itineraries" className="nav-link">
              Itineraries
            </Nav.Link>
            <Nav.Link href="/all-historicalplaces" className="nav-link">
              Historical Places
            </Nav.Link>
            <Nav.Link href="/all-museums" className="nav-link">
              Museums
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="advertiser-container">
        {/* Sidebar */}
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
            <img src={sidebarImage} alt="Sidebar" className="advertiser-sidebar-image" />
          </div>
        </div>

        {/* Main Content */}
        <div className="advertiser-main-content">
          <h1 className="header">Transportation Page</h1>

          <h2 className="section-heading">Create Transportation</h2>
          <Form className="modern-form" onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="startLocation"
                    value={formData.startLocation}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="endLocation"
                    value={formData.endLocation}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Seats Available</Form.Label>
                  <Form.Control
                    type="number"
                    name="seatsAvailable"
                    value={formData.seatsAvailable}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Driver Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="reply-button">
              Create Transportation
            </Button>
          </Form>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}

          <h2 className="section-heading">Available Transportations</h2>
          <Row>
  {transportations.map((transport) => (
    <Col md={4} key={transport._id} className="transportation-card">
      <div className="card">
        <h4 className="card-header">{transport.vehicleType}</h4>
        <div className="card-body">
          <p>
            <strong>Date:</strong> {new Date(transport.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {transport.time}
          </p>
          <p>
            <strong>From:</strong> {transport.startLocation}
          </p>
          <p>
            <strong>To:</strong> {transport.endLocation}
          </p>
          <p>
            <strong>Price:</strong> ${transport.price}
          </p>
          <p>
            <strong>Seats Available:</strong> {transport.seatsAvailable}
          </p>
          <p>
            <strong>Driver:</strong> {transport.driverName}
          </p>
        </div>
      </div>
    </Col>
  ))}
</Row>

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

export default TransportationPage;