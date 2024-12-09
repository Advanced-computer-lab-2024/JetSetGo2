import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate , Link} from 'react-router-dom';

import "../AdvertiserDetails.css"; // Import the updated styles
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 
import sidebarImage from './logoo444.JPG';
import 'bootstrap/dist/css/bootstrap.min.css';
const TouristReport = () => {
  const location = useLocation();
  const adverId = location.state?.adverId; // Access the adverId from state
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // Track selected month
  const navigate = useNavigate();

  // Handle month selection
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!adverId) {
        setError("Advertiser ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/activity/report/${adverId}`,
          {
            params: {
              month: selectedMonth, // Pass selected month as query param
            },
          }
        );
        setReportData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [adverId, selectedMonth]); // Refetch data when adverId or selectedMonth changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
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
  return (
    <div className="advertiser-page">
      {/* Navbar */}
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
          <h1 className="header">Tourist Report</h1>
  
          {/* Month Selection */}
          <div className="report-filter">
            <label htmlFor="month" className="filter-label">Select Month:</label>
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
  
          {/* Total Tourists */}
          <div className="total-tourists">
            <p>Total Tourists: <span className="highlight">{reportData.totalTourists}</span></p>
          </div>
  
          {/* Activity Details */}
          <h2 className="section-heading-modern">Activity Details</h2>
          {reportData.activityDetails.length > 0 ? (
            <div className="activity-list-modern">
              {reportData.activityDetails.map((activity) => (
                <div key={activity.activityId} className="activity-card-modern">
                  <h4 className="activity-title-modern">
                    Activity ID: {activity.activityId}
                  </h4>
                  <p><strong>Location:</strong> {activity.location}</p>
                  <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                  <p><strong>Bookings:</strong> {activity.bookings}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-activities-message">No activities found for the selected month.</p>
          )}
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

export default TouristReport;
