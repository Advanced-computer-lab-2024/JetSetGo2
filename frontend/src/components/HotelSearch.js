import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51QQBfPKbaBifWGn14vu2SZhspEMUJn56AZy9Kcmrq3v8XQv0LDF3rLapvsR6XhA7tZ3YS6vXgk0xgoivUwm03ACZ00NI0XGIMx");

const PaymentForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      alert("Stripe is not ready. Please try again.");
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name", // Replace with actual user name if available
          },
        },
      });

      if (error) {
        console.error("Payment error:", error);
        alert("Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      console.error("Error during payment confirmation:", err);
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
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
          hidePostalCode: true,
        }}
      />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};
const HotelSearch = () => {
  const [cityCode, setCityCode] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [hotels, setHotels] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const navigate = useNavigate();

  // Get Bearer Token from Amadeus API
  const getBearerToken = async () => {
    try {
      const client_id = 'LYT4JF7n7vkYqq6pYNDUMbOBDFSA7ieh';
      const client_secret = 'oGEoeufzY0Miwu4n';
      const data = new URLSearchParams();
      data.append('grant_type', 'client_credentials');
      data.append('client_id', client_id);
      data.append('client_secret', client_secret);

      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        data,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching Bearer token:', error);
      throw error;
    }
  };


  const handleBookOffer = async (offer, hotelName) => {
    const paymentMethod = prompt("Enter payment method (wallet/card):").toLowerCase();
  
    const touristId = localStorage.getItem("userId");
    if (!touristId) {
      alert("Tourist ID not found. Please log in.");
      return;
    }
  
    if (!offer || !offer.price || !offer.price.total) {
      alert("Invalid offer or price data.");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8000/home/tourist/${touristId}/bookHotel`,
        {
          offer,
          hotelName,
          paymentMethod,
        }
      );
  
      if (paymentMethod === "wallet") {
        alert(response.data.message || "Hotel booked successfully using wallet!");
      } else if (paymentMethod === "card") {
        const { clientSecret } = response.data;
        if (clientSecret) {
          setClientSecret(clientSecret);
          setCurrentOffer({ offer, hotelName });
          setIsPaymentModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error booking hotel:", error);
      alert(error.response?.data?.message || "Error booking hotel. Please try again.");
    }
  };
  

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      setIsPaymentModalOpen(false);

      const touristId = localStorage.getItem("userId");

      await axios.post(`http://localhost:8000/home/tourist/${touristId}/bookHotel`, {
        ...currentOffer,
        paymentMethod: "card",
        paymentIntentId,
      });

      alert("Hotel booked successfully!");
    } catch (error) {
      console.error("Error finalizing booking:", error);
      alert("Booking was successful, but there was an error finalizing it.");
    }
  };


  // Search Hotels by City Code
  const searchHotels = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setHotels([]);
    setOffers([]);
    setSelectedHotelId(null);

    try {
      const token = await getBearerToken();

      if (!cityCode || !checkInDate || !checkOutDate) {
        setError('Please enter a city code and select check-in and check-out dates.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.errors) {
        setError('Error fetching hotels.');
      } else {
        setHotels(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Hotel Offers for a selected hotel
  const getHotelOffers = async (hotelId) => {
    setLoading(true);
    setOffers([]);
    setSelectedHotelId(hotelId);

    try {
      const token = await getBearerToken();

      const response = await axios.get(
        `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=["${hotelId}"]&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data.length === 0) {
        setError('No offers available for the selected dates.');
      } else {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hotel offers:', error);
      setError('No offers available for the selected dates.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHotels = () => {
    setSelectedHotelId(null);
    setOffers([]);
  };

  const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      header: {
        textAlign: 'center',
        marginBottom: '20px',
      },
      inputContainer: {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '200px',
      },
      button: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
      },
      card: {
        backgroundColor: '#fff',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      cardDetails: {
        maxWidth: '70%',
      },
      cardTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
      },
      cardAddress: {
        color: '#777',
        fontSize: '14px',
      },
      cardButton: {
        backgroundColor: '#1D72B8',
        color: '#fff',
        padding: '8px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
      },
      offerCard: {
        backgroundColor: '#fff',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      offerDetails: {
        fontSize: '16px',
        marginBottom: '10px',
      },
      error: {
        color: 'red',
        textAlign: 'center',
      },
      successMessage: {
        color: 'green',
        textAlign: 'center',
        margin: '10px 0',
      },
      loading: {
        textAlign: 'center',
      },
      backButton: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: '#1D72B8',
        color: '#fff',
        padding: '8px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      },
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/tourist-home')} style={styles.backButton}>
        Back to Tourist Home
      </button>
      <h1 style={styles.header}>Hotel Search</h1>
      <div style={styles.inputContainer}>
        <label htmlFor="cityCode">City Code (e.g., NYC)</label>
        <input
          id="cityCode"
          type="text"
          placeholder="City Code (e.g., NYC)"
          value={cityCode}
          onChange={(e) => setCityCode(e.target.value.toUpperCase())}
          style={styles.input}
        />
  
        <label htmlFor="checkInDate">Check-In Date</label>
        <input
          id="checkInDate"
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          style={styles.input}
        />
  
        <label htmlFor="checkOutDate">Check-Out Date</label>
        <input
          id="checkOutDate"
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          style={styles.input}
        />
      </div>
      <button onClick={searchHotels} disabled={loading} style={styles.button}>
        {loading ? 'Searching...' : 'Search Hotels'}
      </button>
  
      {error && <p style={styles.error}>{error}</p>}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
  
      {hotels.length > 0 && !selectedHotelId && (
        <div>
          <h2>Hotel Results</h2>
          {hotels.map((hotel, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardDetails}>
                <p style={styles.cardTitle}>{hotel.name}</p>
                <p style={styles.cardAddress}>Location: {hotel.iataCode}</p>
              </div>
              <button
                onClick={() => getHotelOffers(hotel.hotelId)}
                style={styles.cardButton}
              >
                View Offers
              </button>
            </div>
          ))}
        </div>
      )}
  
      {selectedHotelId && (
        <>
          <button onClick={handleBackToHotels}>Back to Hotels</button>
          {offers.length === 0 ? (
            <div style={styles.loading}>
              <h2>Fetching Offers for Hotel...</h2>
            </div>
          ) : (
            <div>
              <h2>Hotel Offers</h2>
              {offers.map((offer, index) => (
                <div key={index} style={styles.hotelCard}>
                  <h3 style={styles.hotelName}>Hotel: {offer.hotel.name}</h3>
                  <p style={styles.hotelLocation}>Location: {offer.hotel.cityCode}</p>
  
                  {offer.offers.map((individualOffer, offerIndex) => (
                    <div key={offerIndex} style={styles.offerCard}>
                      <h4 style={styles.offerTitle}>Offer {offerIndex + 1}</h4>
                      <p style={styles.offerDetails}>Check-In Date: {individualOffer.checkInDate}</p>
                      <p style={styles.offerDetails}>Check-Out Date: {individualOffer.checkOutDate}</p>
                      <p style={styles.offerDetails}>Room Type: {individualOffer.room.typeEstimated.category}</p>
                      <p style={styles.offerDetails}>
                        Beds: {individualOffer.room.typeEstimated.beds}, Type: {individualOffer.room.typeEstimated.bedType}
                      </p>
                      <p style={styles.offerDetails}>
                        Description: {individualOffer.room.description?.text || "No description available"}
                      </p>
                      <p style={styles.offerDetails}>Guests: {individualOffer.guests.adults} Adults</p>
                      <p style={styles.offerDetails}>
                        Price: {individualOffer.price.total} {individualOffer.price.currency}
                      </p>
                      <p style={styles.offerDetails}>
                        Cancellation Policy: {individualOffer.policies.cancellations?.[0].deadline
                          ? `Free cancellation before ${individualOffer.policies.cancellations[0].deadline}`
                          : "No free cancellation"}
                      </p>
                      <button
                        onClick={() => handleBookOffer(individualOffer, offer.hotel.name)}
                        style={styles.button}
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
  
      {isPaymentModalOpen && (
        <div style={{ marginTop: "20px" }}>
          <h3>Complete Your Payment</h3>
          <Elements stripe={stripePromise}>
            <PaymentForm
              clientSecret={clientSecret}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
  
};

export default HotelSearch;
