import React, { useState, useEffect } from "react";
import { useLocation,Link,useNavigate } from "react-router-dom";

import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from './logoo444.JPG';
import "./TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 
const TouristReport = () => {
  const location = useLocation();
  const userId = location.state?.userId; // Retrieve tourGuideId from state
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Details");
  const [selectedMonth, setSelectedMonth] = useState(""); // Track selected month
  const [tourGuide, setTourGuide] = useState(null);
  const navigate = useNavigate();


  

  // Handle month selection
  const handleMonthChange = async (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!userId) {
        setError("Tour Guide ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/itinerary/report/${userId}`, {
          params: {
            month: selectedMonth, // Pass selected month as query param
          },
        });
        setReportData(response.data); // Set the data to state
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId, selectedMonth]); // Fetch the report whenever userId or selectedMonth changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
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

  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  const handleRevenuePage = () => {
    navigate("/revenue");
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

<Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="admin-tabs">
      {/* Tourist Report Tab */}
      <Tab eventKey="touristReport" title="Tourist Report">
        <div className="form-container">
          <h1 className="section-title">Tourist Report</h1>

          <div className="filters-container">
            <label htmlFor="month">Select Month:</label>
            <select id="month" value={selectedMonth} onChange={handleMonthChange} className="filter-select">
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <p className="total-tourists">Total Tourists: {reportData.totalTourists}</p>

          <h2 className="section-subtitle">Itinerary Details</h2>
          {reportData.itineraryDetails.length > 0 ? (
            <ul className="itinerary-list">
              {reportData.itineraryDetails.map((itinerary) => (
                <li key={itinerary.itineraryId} className="itinerary-card">
                  <p><strong>Itinerary ID:</strong> {itinerary.itineraryId}</p>
                  <p><strong>Name:</strong> {itinerary.name}</p>
                  <p><strong>Total Bookings:</strong> {itinerary.totalBookings}</p>
                  <p><strong>Bookings:</strong> {itinerary.bookings}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No itinerary details available.</p>
          )}
        </div>
      </Tab>
    </Tabs>
    </div>
    <div className="right-sidebar">
  <div className="sidebar-buttons">
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

export default TouristReport;
