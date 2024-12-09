import React, { useState, useEffect } from "react";
import { useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from '../logoo444.JPG';
import "../TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from '../logoo4.JPG';
import { FaPen } from "react-icons/fa"; 






// Service method to fetch itineraries
const getItineraries = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/itinerary/getIteneraries`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    throw error;
  }
};

// Service method to toggle activation of an itinerary
const toggleItineraryActivation = async (id) => {
  try {
    console.log(`Toggling activation for itinerary with ID: ${id}`); // Log request
    const response = await axios.patch(
      `http://localhost:8000/itinerary/toggleActivation/${id}`
    );
    console.log(`Response from toggle activation:`, response.data); // Log response
    return response.data;
  } catch (error) {
    console.error("Error toggling activation:", error);
    throw error;
  }
};

const Itinerariestg = () => {
  const userId = localStorage.getItem("userId"); // Retrieve the Tour Guide ID from local storage

  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]); // To store filtered itineraries
  const [error, setError] = useState(null);
  const [tourGuide, setTourGuide] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [activeTab, setActiveTab] = useState("Details");



  const [sortOrder, setSortOrder] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [Tags, setTags] = useState([]);
  const [activities, setActivities] = useState([]);

  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/itinerary/getIteneraries`
      );
      const data = response.data;

      // Filter out flagged itineraries
      const nonFlaggedItineraries = data.filter(itinerary => !itinerary.flagged);

      setItineraries(nonFlaggedItineraries);
      setFilteredItineraries(nonFlaggedItineraries); // Initially set filtered to all non-flagged itineraries
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError("Failed to load itineraries.");
    }
  };
  const handleRevenuePage = () => {
    navigate("/revenue");
  };
  const handleBackClick = () => {
    navigate(-1); // Navigate back
  };
  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
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

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activity/get");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/prefTags/readtag"
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching Tags:", error);
    }
  };

  useEffect(() => {
    fetchItineraries();
    fetchTags();
    fetchActivities();
  }, []);

  // Filter itineraries based on selected filters
  useEffect(() => {
    let filtered = itineraries;

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((itinerary) =>
        Array.isArray(itinerary.Tags)
          ? itinerary.Tags.some((tag) => tag.name === selectedTag)
          : itinerary.Tags.name === selectedTag
      );
    }

    // Filter by price
    if (selectedPrice) {
      filtered = filtered.filter(
        (itinerary) =>
          Math.min(...itinerary.TourPrice) <= parseFloat(selectedPrice)
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((itinerary) =>
        itinerary.availableDates.some(
          (date) =>
            new Date(date).toDateString() ===
            new Date(selectedDate).toDateString()
        )
      );
    }

    // Filter by language
    if (selectedLanguage) {
      filtered = filtered.filter((itinerary) =>
        itinerary.tourLanguage.includes(selectedLanguage)
      );
    }

    setFilteredItineraries(filtered);
  }, [itineraries, selectedTag, selectedPrice, selectedDate, selectedLanguage]);

  // Sorting functions remain unchanged
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);

    let sortedItineraries = [...filteredItineraries];
    if (value === "asc") {
      sortedItineraries.sort(
        (a, b) => Math.min(...a.TTourPrice) - Math.min(...b.TourPrice)
      );
    } else if (value === "desc") {
      sortedItineraries.sort(
        (a, b) => Math.max(...b.TourPrice) - Math.max(...a.TourPrice)
      );
    }
    setFilteredItineraries(sortedItineraries);
  };

  const handleSortRatingChange = (e) => {
    const value = e.target.value;
    setSortRating(value);

    let sortedItineraries = [...filteredItineraries];
    if (value === "asc") {
      sortedItineraries.sort((a, b) => a.rating - b.rating);
    } else if (value === "desc") {
      sortedItineraries.sort((a, b) => b.rating - a.rating);
    }
    setFilteredItineraries(sortedItineraries);
  };


// Toggle activation handler
const handleToggleActivation = async (id) => {
    try {
      console.log(`Handling toggle activation for ID: ${id}`);
      const updatedItinerary = await toggleItineraryActivation(id);
      console.log("Updating itinerary in the state...");
  
      // Update the specific itinerary in the state
      setItineraries((prevItineraries) => {
        const updated = prevItineraries.map((itinerary) => {
          // Check if the itinerary ID matches the toggled one
          if (itinerary._id === updatedItinerary.itinerary._id) {
            // Merge the updated fields with the existing fields to preserve `activities` and others
            return {
              ...itinerary, // Preserve the existing fields
              isActive: updatedItinerary.itinerary.isActive, // Update only the status
            };
          }
          return itinerary; // Return unchanged itineraries
        });
        console.log("Updated itineraries:", updated);
        return updated;
      });
  
      // Optionally, you can also update filtered itineraries
      setFilteredItineraries((prevItineraries) => {
        const updated = prevItineraries.map((itinerary) => {
          if (itinerary._id === updatedItinerary.itinerary._id) {
            return {
              ...itinerary,
              isActive: updatedItinerary.itinerary.isActive,
            };
          }
          return itinerary;
        });
        console.log("Updated filtered itineraries:", updated);
        return updated;
      });
    } catch (error) {
      console.error("Error toggling activation:", error);
      setError("Failed to toggle activation.");
    }
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
          
        </Nav>
      </Container>
    </Navbar>
    <div className="admin-container">
    <div className="sidebar">
  <div className="profile-container">
    
    <button className="sidebar-button" onClick={handleLogout}>
      Logout
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


<Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="tg">
  {/* View Itineraries Tab */}
  <Tab eventKey="viewItineraries" title="View Itineraries">
    <div className="itineraries-container">

      {/* Filter and Sort controls */}
      <div className="filters-container">
        <Form.Group className="mb-3">
          <Form.Label>Filter by Tag</Form.Label>
          <Form.Control
            type="text"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            placeholder="Enter tag"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Filter by Max Price</Form.Label>
          <Form.Control
            type="number"
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            placeholder="Enter max price"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Filter by Date</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sort by Price</Form.Label>
          <Form.Select value={sortOrder} onChange={handleSortChange}>
            <option value="">Select</option>
            <option value="asc">Lowest to Highest</option>
            <option value="desc">Highest to Lowest</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sort by Rating</Form.Label>
          <Form.Select value={sortRating} onChange={handleSortRatingChange}>
            <option value="">Select</option>
            <option value="asc">Lowest to Highest</option>
            <option value="desc">Highest to Lowest</option>
          </Form.Select>
        </Form.Group>
      </div>

      {/* Display itineraries */}
      {error && <p className="error-message">{error}</p>}

      {filteredItineraries.length > 0 ? (
        <ul className="itinerary-list">
          {filteredItineraries.map((itinerary) => (
            <li key={itinerary._id} className="itinerary-card">
              <div className="itinerary-details">
                <h3 className="itinerary-title">{itinerary.name}</h3>
                <p>
                  <strong>Tour Price:</strong> ${itinerary.TourPrice.join(", ")}
                </p>
                <p>
                  <strong>Duration of Activities:</strong> {itinerary.durationActivity.join(", ")} hours
                </p>
                <p>
                  <strong>Available Dates:</strong>{" "}
                  {itinerary.availableDates.map((date) => new Date(date).toLocaleDateString()).join(", ")}
                </p>
                <p>
                  <strong>Activities:</strong>{" "}
                  {itinerary.activities.map(
                    (activity) => `${activity.date} - ${activity.time} - ${activity.location} - ${activity.price}`
                  ).join(", ")}
                </p>
                <p>
                  <strong>Tags:</strong>{" "}
                  {Array.isArray(itinerary.Tags) ? itinerary.Tags.map((tag) => tag.name).join(", ") : itinerary.Tags.name}
                </p>
                <p>
                  <strong>Languages:</strong> {itinerary.tourLanguage.join(", ")}
                </p>
                <p>
                  <strong>Number of Bookings:</strong> {itinerary.bookings}
                </p>
                <p>
                  <strong>Status:</strong> {itinerary.isActive ? "Active" : "Deactivated"}
                </p>
              </div>

              {/* Toggle activation button */}
              <div className="itinerary-actions">
                <Button 
                  onClick={() => handleToggleActivation(itinerary._id)}

                  className={`${itinerary.isActive ? "deactivate-btn" : "activate-btn"} reply-button`}                >
                  {itinerary.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries available.</p>
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

export default Itinerariestg;
