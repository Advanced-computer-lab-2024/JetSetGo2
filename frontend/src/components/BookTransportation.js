import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51QQBfPKbaBifWGn14vu2SZhspEMUJn56AZy9Kcmrq3v8XQv0LDF3rLapvsR6XhA7tZ3YS6vXgk0xgoivUwm03ACZ00NI0XGIMx"); // Replace with your Stripe publishable key

const PaymentForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements || !clientSecret) {
      alert("Stripe or client secret is not ready. Please try again.");
      return;
    }
  
    setIsProcessing(true);
  
    const cardElement = elements.getElement(CardElement);
  
    try {
      // Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name", // Replace with the actual user's name
          },
        },
      });
  
      // Log the payment intent after confirmation
      console.log("Payment Intent after confirmation:", paymentIntent);
  
      // Handle payment errors or success
      if (error) {
        console.error("Payment error:", error);
        alert(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        alert("Payment successful!");
  
        // Call the backend to finalize the booking
        onPaymentSuccess(paymentIntent.id); // Pass the paymentIntent ID to finalize booking
      } else {
        console.error("Unexpected PaymentIntent status:", paymentIntent.status);
        alert("Payment was not successful. Please try again.");
      }
    } catch (err) {
      console.error("Error during payment confirmation:", err.message);
      alert(`An error occurred: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
          hidePostalCode: true, // This disables the ZIP/postal code field
        }}
      />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};


const TransportationBooking = () => {
  const [transportations, setTransportations] = useState([]);
  const [bookedTransportations, setBookedTransportations] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const API_URL = "http://localhost:8000"; // Change to your backend URL
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentTransportationId, setCurrentTransportationId] = useState(null);
  const [date, setDate] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
  const touristId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage

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
  const handleBooking = async (id) => {
    const paymentMethod = prompt("Enter payment method (wallet/card):").toLowerCase();

    if (!touristId) {
      alert("Tourist ID not found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/home/tourist/bookTransportation/${touristId}/${id}`,
        { paymentMethod }
      );

      if (response.status === 200) {
        const { clientSecret } = response.data;
        if (paymentMethod === "card" && clientSecret) {
          setCurrentTransportationId(id);
          setClientSecret(clientSecret);
          setIsPaymentModalOpen(true); // Open payment modal
        } else {
          alert(response.data.message || "Transportation booked successfully using wallet!");
          fetchTransportations(); // Refresh transportations
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message); // Display message from backend
      } else {
        console.error("Error initiating booking:", error);
        alert("Error initiating booking. Please try again.");
      }
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      setIsPaymentModalOpen(false);

      // Call backend to finalize booking
      await axios.post(
        `http://localhost:8000/home/tourist/transportation/finalizeBooking/${currentTransportationId}`,
        { userId: touristId, paymentIntentId }
      );

      alert("Transportation booked successfully!");
      fetchTransportations(); // Refresh transportations
    } catch (error) {
      console.error("Error finalizing booking:", error);
      alert("Booking was successful, but there was an error finalizing it. Please contact support.");
    }
  };



  const handleHomeNavigation = () => {
    navigate('/tourist-home'); // Adjust this path according to your routing setup
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/transportation/search`, {
        params: { date, startLocation, endLocation, vehicleType },
      });
      setTransportations(response.data);
      setError("");
      setSearchPerformed(true);
    } catch (err) {
      setError("Error fetching transportations. Please try again.");
      setSearchPerformed(true);
    }
  };



  return (
    <div style={styles.transportationPage}>
      {/* Home Button */}
      {isPaymentModalOpen && (
        <div className="payment-modal">
          <Elements stripe={stripePromise}>
            <PaymentForm clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        </div>
      )}
      <button onClick={handleHomeNavigation} className="home-button">
        Home
      </button>
      <h2 style={styles.pageTitle}>Available Transportations</h2>

      {/* Error and Success Messages */}
      {error && <p style={styles.errorMessage}>{error}</p>}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

      <div style={styles.form}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
          placeholder="Date"
        />
        <input
          type="text"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          style={styles.input}
          placeholder="Start Location"
        />
        <input
          type="text"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          style={styles.input}
          placeholder="End Location"
        />
        <input
          type="text"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          style={styles.input}
          placeholder="Vehicle Type"
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      <div style={styles.transportationCards}>
        {searchPerformed && transportations.length > 0 ? (
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
          searchPerformed && <p style={styles.noTransportations}>No transportations available.</p>
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
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    margin: "10px",
    width: "80%",
    maxWidth: "400px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default TransportationBooking;