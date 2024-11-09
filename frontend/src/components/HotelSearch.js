import React, { useState } from 'react';
import axios from 'axios';

const HotelSearch = () => {
  const [cityCode, setCityCode] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [hotels, setHotels] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

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

  // Search Hotels by City Code
  const searchHotels = async () => {
    setLoading(true);
    setError(null);
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
        `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`,
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
      setError('An error occurred. Please try again.');
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
      loading: {
        textAlign: 'center',
      },
  };

  return (
    <div style={styles.container}>
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
          <button onClick={handleBackToHotels} style={styles.backButton}>
            Back to Hotels
          </button>
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
                      <button style={styles.button}>Book Now</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HotelSearch;
