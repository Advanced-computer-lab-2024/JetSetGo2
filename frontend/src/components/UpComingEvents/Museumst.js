import React, { useState, useEffect } from "react";
import { getMuseum } from "../../services/MuseumService"; // Update this path as needed
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from '../logoo444.JPG';
import "../TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from '../logoo4.JPG';
import { FaPen } from "react-icons/fa"; 
// Fix marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [bookmarkedMuseums, setBookmarkedMuseums] = useState([]); 
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(""); // For storing selected tag
  const [filteredMuseums, setFilteredMuseums] = useState([]); // For storing filtered museums based on selected tag
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [bookedHP, setBookedHP] = useState([]); // Track booked activities
  const convertPrice = (price) => {
    return (price * currencyRates[selectedCurrency]).toFixed(2);
  };
  const currencyRates = {
    EUR: 1,    // Base currency (assumed for conversion)
    USD: 1,  // Example conversion rate
    EGP: 30,   // Example conversion rate
  };
  const [selectedCurrency, setSelectedCurrency] = useState("EGP"); // Default currency
  const touristId = localStorage.getItem("userId");

  // Fetch museums when the component mounts
  useEffect(() => {
    fetchMuseums();
    // Load booked activities from localStorage when the component mounts
    const storedBookings = JSON.parse(localStorage.getItem("bookedHP")) || [];
    setBookedHP(storedBookings);
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
    } catch (error) {
      console.error("Error fetching Museums:", error);
      setError("Failed to load Museums.");
    }
  };
// Fetch bookmarked museums
const fetchBookmarkedMuseums = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/bookmarkMuseum/${touristId}`
    );
    setBookmarkedMuseums(response.data.map((museum) => museum._id));
  } catch (error) {
    console.error("Error fetching bookmarked museums:", error);
  }
};

const handleBookmarkToggle = async (museumId) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/bookmarkMuseum/${touristId}/${museumId}`
    );

    if (response.status === 200) {
      console.log("Bookmark toggled:", response.data);

      // Update local state immediately
      setBookmarkedMuseums((prevBookmarks) => {
        if (prevBookmarks.includes(museumId)) {
          // Remove from bookmarks
          return prevBookmarks.filter((id) => id !== museumId);
        } else {
          // Add to bookmarks
          return [...prevBookmarks, museumId];
        }
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    alert("Failed to toggle bookmark. Please try again.");
  }
};


const viewBookmarkedMuseums = async () => {
  if (!touristId) {
    alert("Tourist ID not found. Please log in.");
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:8000/bookmarkMuseum/${touristId}`
    );

    if (response.status === 200) {
      const bookmarked = response.data.bookmarkedMuseums;
      if (bookmarked.length > 0) {
        setFilteredMuseums(bookmarked); // Set the filtered museums to the bookmarked ones
        setShowOnlyBookmarked(true);
      } else {
        alert("No bookmarked museums to display.");
        setFilteredMuseums([]); // Clear filtered museums if no bookmarks exist
      }
    }
  } catch (error) {
    console.error("Error fetching bookmarked museums:", error);
    alert("Failed to fetch bookmarked museums. Please try again.");
  }
};

const viewAllMuseums = () => {
  setFilteredMuseums(museums);
};

  // Share by copying the link
  const handleCopybylink = (place) => {
    const link = `http://localhost:3000/M/${place._id}`;
    navigator.clipboard.writeText(link)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link."));
  };

  // Share via email
  const handleShare = (place) => {
    const subject = encodeURIComponent(`Check out this historical place: ${place.tourismGovernerTags?.name || place.location}`);
    const body = encodeURIComponent(`
      Here are the details of the historical place:
      - Location: ${place.location}
      - Description: ${place.description}
      - Opening Hours: ${place.openingHours}
      - Ticket Price: $${place.ticketPrice}
      You can view more details here: http://localhost:3000/M/${place._id}
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  const handleBookTour = async (id) => {
    try {
      console.log("tourist ID:", touristId);
      console.log("hp ID:", id);
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }
      const response = await axios.patch(
       ` http://localhost:8000/museum/book/${id}`,
        { userId: touristId } // Send touristId in the request body
      );

      if (response.status === 200) {
        // Update the bookings count in the UI
        setBookedHP((prev) => {
          const updatedBookedHP = [...prev, id];
          localStorage.setItem("bookedHP", JSON.stringify(updatedBookedHP)); // Persist to localStorage
          return updatedBookedHP; // Return updated state
        })
        alert("activity booked successfully!");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
      alert("already booked");
    }
  };
  const handleCancelBooking = async (id) => {
    try {
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }
  
      // Find the activity that is being canceled
      const HPToCancel = museums.find(Historicalplace => Historicalplace._id=== id);
      if (!HPToCancel) {
        throw new Error("Activity not found.");
      }
  
      const HPDate = new Date(HPToCancel.date); // Convert to Date object
  
      // Calculate the difference in hours
      const hoursDifference = (HPDate - Date.now()) / (1000 * 60 * 60);
      if (hoursDifference < 48) {
        throw new Error("Cancellations are allowed only 48 hours before the activity date.");
      }
  
      // Proceed to cancel the booking only if the 48-hour rule is met
      const response = await axios.post(
        `http://localhost:8000/museum/cancelHP/${id}`,
        { userId: touristId }
      );
  
      if (response.status === 200) {
        setBookedHP((prev) => {
          const updatedBookedHP = prev.filter((HPId) => HPId !== id);
          localStorage.setItem("bookedHP", JSON.stringify(updatedBookedHP)); // Update in localStorage
          return updatedBookedHP; // Return updated state
        });
        alert("Booking canceled successfully!");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(error.message || "An error occurred while canceling the booking.");
    }
  };

  return (
    <div id="museums" className="tour-guide-page">
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#" className="navbar-brand">
            <img src={img1} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
          <Nav className="ml-auto"></Nav>
        </Container>
      </Navbar>
  
      <div className="admin-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="profile-container">
            <button className="sidebar-button" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="sidebar-button" onClick={viewAllMuseums}>
              View All Museums
            </button>
            <button className="sidebar-button" onClick={viewBookmarkedMuseums}>
              View Bookmarked Museums
            </button>
          </div>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
          </div>
        </div>
  
        {/* Main Content */}
        <div className="main-content">
          <Tabs defaultActiveKey="museums" className="tg">
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
                        .map((place) => place.tourismGovernerTags?.type || "Unknown")
                        .filter(
                          (value, index, self) => value && self.indexOf(value) === index
                        )
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
                  <div className="museum-cards">
                    {filteredMuseums.map((place) => {
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
  
                          <div className="museum-card-buttons">
                            {mapSrc && (
                              <iframe
                                title={`Map for ${place.location}`}
                                src={mapSrc}
                                className="museum-map"
                              ></iframe>
                            )}
                        
                            <button
                              className="card-button share-button"
                              onClick={() => handleCopybylink(place)}
                            >
                              Share via Copy Link
                            </button>
                            <button
                              className="card-button share-button"
                              onClick={() => handleShare(place)}
                            >
                              Share via Mail
                            </button>
                            <button
  onClick={() => handleBookmarkToggle(place._id)}
  style={{
    backgroundColor: bookmarkedMuseums.includes(place._id) ? "gold" : "gray",
    color: bookmarkedMuseums.includes(place._id) ? "black" : "white",
  }}
>
  {bookmarkedMuseums.includes(place._id) ? "Unbookmark" : "Bookmark"}
</button>
    </div>
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
  
        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-buttons"></div>
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
    backgroundColor: "#f7f8f9",
  },
};

export default Museums;