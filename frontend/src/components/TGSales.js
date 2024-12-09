import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from './logoo444.JPG';
import "./TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 

const TGSales = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activityFilter, setActivityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");

  const navigate = useNavigate();


  const userId = localStorage.getItem("userId"); // Retrieve the userId
  

  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/itinerary/bookedItineraries/${userId}`
        );
        setItineraries(response.data);
        setFilteredItineraries(response.data); // Set initially to all itineraries

        // Calculate total revenue
        const total = response.data.reduce((acc, itinerary) => {
          return acc + itinerary.bookings * itinerary.TourPrice * 0.9;
        }, 0);
        setTotalRevenue(total);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setError("Failed to fetch itineraries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [userId]);

  // Apply frontend filtering
  useEffect(() => {
    let filtered = itineraries;

    // Filter by activity
    if (activityFilter) {
      filtered = filtered.filter((itinerary) =>
        itinerary.name?.toLowerCase().includes(activityFilter.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(
        (itinerary) =>
          new Date(itinerary.date).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    // Filter by month
    if (monthFilter) {
      filtered = filtered.filter(
        (itinerary) =>
          new Date(itinerary.date).getFullYear() === new Date(monthFilter).getFullYear() &&
          new Date(itinerary.date).getMonth() === new Date(monthFilter).getMonth()
      );
    }

    setFilteredItineraries(filtered);

    // Recalculate total revenue
    const total = filtered.reduce((acc, itinerary) => {
      return acc + itinerary.bookings * itinerary.TourPrice * 0.9;
    }, 0);
    setTotalRevenue(total);
  }, [activityFilter, dateFilter, monthFilter, itineraries]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
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

<Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="admin-tabs">
  {/* Revenue Dashboard Tab */}
  <Tab eventKey="revenueDashboard" title="Revenue Dashboard">
    <div className="form-container">
      <div className="dashboard-header">
        <h3 className="total-revenue">Total Revenue: ${totalRevenue.toFixed(2)}</h3>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Filter by activity"
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
          className="filter-input"
        />
        <input
          type="date"
          placeholder="Filter by date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="filter-input"
        />
        <input
          type="month"
          placeholder="Filter by month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Booked Itineraries */}
<div className="itineraries-container">
  <h3>Booked Itineraries</h3>
  {filteredItineraries.length > 0 ? (
    <div className="itinerary-cards">
      {filteredItineraries.map((itinerary) => (
        <div key={itinerary._id} className="itinerary-card">
          <div className="itinerary-header">
            <h4>{itinerary.name || "Unnamed Itinerary"}</h4>
            <span className="itinerary-price">${itinerary.TourPrice || 0}</span>
          </div>

          <div className="itinerary-details">
            <div className="itinerary-detail">
              <p><strong>Bookings:</strong> {itinerary.bookings || 0}</p>
              <p><strong>Revenue from this itinerary:</strong> ${(itinerary.TourPrice * itinerary.bookings).toFixed(2)}</p>
            </div>
            <div className="itinerary-detail">
              <p><strong>Total revenue:</strong> ${(itinerary.bookings * itinerary.TourPrice * 0.9).toFixed(2)}</p>
            </div>
          </div>

          <div className="itinerary-actions">
            <button className="reply-button">View Details</button>
            <button className="reply-button">View Revenue Breakdown</button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No itineraries with bookings found.</p>
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

export default TGSales;
