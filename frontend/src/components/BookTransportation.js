import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from 'react-router-dom';

const TransportationBooking = () => {
  const [transportations, setTransportations] = useState([]);
  const [bookedTransportations, setBookedTransportations] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const API_URL = "http://localhost:8000"; // Change to your backend URL
  const navigate = useNavigate();

  // Fetch all transportations and booked transportations on component mount
  useEffect(() => {
    fetchTransportations();
    fetchBookedTransportations();
  }, []);

  const fetchTransportations = async () => {
    try {
      const response = await axios.get(`${API_URL}/transportation/get`);
      setTransportations(response.data);
    } catch (error) {
      console.error("Error fetching transportations:", error);
      setError("Failed to fetch transportations. Please try again later.");
    }
  };

  const fetchBookedTransportations = async () => {
    const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
    if (!userId) {
      setError("User ID not found in local storage. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/home/tourist/getBookedTransportations/${userId}`);
      
      // Group the booked transportations by transportation ID and count them
      const groupedTransportations = response.data.reduce((acc, transport) => {
        const index = acc.findIndex(item => item._id === transport._id);
        if (index === -1) {
          acc.push({ ...transport, count: 1 }); // Add new transportation with count 1
        } else {
          acc[index].count += 1; // Increment count for existing transportation
        }
        return acc;
      }, []);
      
      setBookedTransportations(groupedTransportations);
    } catch (error) {
      console.error("Error fetching booked transportations:", error);
      setError("Failed to fetch booked transportations. Please try again later.");
    }
  };

  const handleBooking = async (transportationId) => {
    const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
    if (!userId) {
      setError("User ID not found in local storage. Please log in.");
      return;
    }

    try {
      // Make an API call to book the transportation and pass touristId and transportationId
      const response = await axios.post(
        `${API_URL}/home/tourist/bookTransportation/${userId}/${transportationId}`
      );

      setSuccessMessage("Transportation booked successfully!");

      // Update the transportation list to reflect the seat decrement and booking closure
      const updatedTransportations = transportations.map((transport) =>
        transport._id === transportationId
          ? { ...transport, seatsAvailable: transport.seatsAvailable - 1, isBookingOpen: transport.seatsAvailable > 1 }
          : transport
      );

      setTransportations(updatedTransportations);

      // Optionally, you can show the booked transportations separately below the available ones
      fetchBookedTransportations();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error booking transportation:", error);
      setError("Failed to book transportation. Please try again.");
    }
  };

  const handleHomeNavigation = () => {
    navigate('/home'); // Adjust this path according to your routing setup
  };

  return (
    <div style={styles.transportationPage}>
      {/* Home Button */}
      <button onClick={handleHomeNavigation} className="home-button">
        Home
      </button>
      <h2 style={styles.pageTitle}>Available Transportations</h2>

      {/* Error and Success Messages */}
      {error && <p style={styles.errorMessage}>{error}</p>}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

      <div style={styles.transportationCards}>
        {transportations.length > 0 ? (
          transportations.map((transport) => (
            <div key={transport._id} style={styles.transportationCard}>
              <h4 style={styles.cardTitle}>{transport.vehicleType}</h4>
              <p><strong>Date:</strong> {new Date(transport.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {transport.time}</p>
              <p><strong>From:</strong> {transport.startLocation}</p>
              <p><strong>To:</strong> {transport.endLocation}</p>
              <p><strong>Price:</strong> ${transport.price}</p>
              <p><strong>Seats Available:</strong> {transport.seatsAvailable}</p>
              <p><strong>Driver:</strong> {transport.driverName}</p>
              <p style={{ ...styles.bookingStatus, color: transport.isBookingOpen ? "green" : "red" }}>
                {transport.isBookingOpen ? "Booking Open" : "Booking Closed"}
              </p>
              {/* Booking Button */}
              {transport.isBookingOpen && (
                <button
                  onClick={() => handleBooking(transport._id)}
                  style={styles.bookingButton}
                >
                  Book Now
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={styles.noTransportations}>No transportations available.</p>
        )}
      </div>

      <div style={styles.bookedTransportations}>
        <h3>Your Booked Transportations</h3>
        {bookedTransportations.length > 0 ? (
          bookedTransportations.map((transport) => (
            <div key={transport._id} style={styles.transportationCard}>
              <h4 style={styles.cardTitle}>{transport.vehicleType}</h4>
              <p><strong>Date:</strong> {new Date(transport.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {transport.time}</p>
              <p><strong>From:</strong> {transport.startLocation}</p>
              <p><strong>To:</strong> {transport.endLocation}</p>
              <p><strong>Price:</strong> ${transport.price}</p>
              <p><strong>Seats Available:</strong> {transport.seatsAvailable}</p>
              <p><strong>Booked Count:</strong> {transport.count}</p> {/* Show the booking count */}
            </div>
          ))
        ) : (
          <p style={styles.noTransportations}>No booked transportations yet.</p>
        )}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  transportationPage: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    maxWidth: "1200px",
    margin: "auto",
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#333",
  },
  transportationCards: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  transportationCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "300px",
    textAlign: "left",
  },
  cardTitle: {
    marginBottom: "10px",
    fontSize: "1.5rem",
    color: "#007bff",
  },
  bookingStatus: {
    fontWeight: "bold",
  },
  bookingButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: "10px",
  },
  successMessage: {
    color: "green",
    textAlign: "center",
    marginTop: "10px",
  },
  noTransportations: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666",
  },
  bookedTransportations: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
  },
};

export default TransportationBooking;
