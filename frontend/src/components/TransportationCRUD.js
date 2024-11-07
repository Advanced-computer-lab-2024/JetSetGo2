import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from 'react-router-dom';

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
    isBookingOpen: true,
  });
  const [transportations, setTransportations] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const API_URL = "http://localhost:8000";
  const navigate = useNavigate();

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
        isBookingOpen: true,
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
    <div style={styles.transportationPage}>
      {/* Home Button */}
      <button onClick={handleHomeNavigation} className="home-button">
        Home
      </button>
      <h2 style={styles.pageTitle}>Create Transportation</h2>
      <form style={styles.transportationForm} onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="startLocation"
          placeholder="Start Location"
          value={formData.startLocation}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="endLocation"
          placeholder="End Location"
          value={formData.endLocation}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price ($)"
          value={formData.price}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="vehicleType"
          placeholder="Vehicle Type"
          value={formData.vehicleType}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="seatsAvailable"
          placeholder="Seats Available"
          value={formData.seatsAvailable}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="driverName"
          placeholder="Driver Name"
          value={formData.driverName}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <label style={styles.bookingLabel}>
          Booking Open:
          <input
            type="checkbox"
            name="isBookingOpen"
            checked={formData.isBookingOpen}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                isBookingOpen: e.target.checked,
              }))
            }
          />
        </label>
        <button type="submit" style={styles.submitButton}>
          Create Transportation
        </button>
        {error && <p style={styles.errorMessage}>{error}</p>}
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
      </form>

      <h3 style={styles.sectionTitle}>Available Transportations</h3>
      <div style={styles.transportationCards}>
        {transportations.length > 0 ? (
          transportations.map((transport) => (
            <div key={transport._id} style={styles.transportationCard}>
              <h4 style={styles.cardTitle}>{transport.vehicleType}</h4>
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
              <p
                style={{
                  ...styles.bookingStatus,
                  color: transport.isBookingOpen ? "green" : "red",
                }}
              >
                {transport.isBookingOpen ? "Booking Open" : "Booking Closed"}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.noTransportations}>No transportations available.</p>
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
  transportationForm: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "30px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "calc(33.33% - 10px)",
  },
  submitButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  bookingLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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
  sectionTitle: {
    textAlign: "center",
    fontSize: "2rem",
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
  noTransportations: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666",
  },
};

export default TransportationPage;
