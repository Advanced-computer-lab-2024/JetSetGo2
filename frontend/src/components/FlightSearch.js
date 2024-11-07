import React, { useState } from 'react';
import axios from 'axios';

const FlightSearch = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [airlineCode, setAirlineCode] = useState('');
const [departureTime, setDepartureTime] = useState('');


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

    const searchFlights = async () => {
        setLoading(true);
        setError(null);
        setResults([]);
    
        try {
            const token = await getBearerToken();
    
            if (!origin || origin.length !== 3 || !destination || destination.length !== 3) {
                setError('Invalid IATA codes. Please enter valid 3-letter airport codes.');
                setLoading(false);
                return;
            }
            if (!departureDate) {
                setError('Please select a departure date.');
                setLoading(false);
                return;
            }
    
            const response = await axios.get(
                'https://test.api.amadeus.com/v2/shopping/flight-offers',
                {
                    params: {
                        originLocationCode: origin,
                        destinationLocationCode: destination,
                        departureDate: departureDate,
                        adults: 1,
                    },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            // Apply filtering to only show flights matching all search criteria
            const filteredResults = response.data.data.filter((flight) => {
                const flightOrigin = flight.itineraries[0].segments[0].departure.iataCode;
                const flightDestination = flight.itineraries[0].segments[0].arrival.iataCode;
                const flightAirlineCode = flight.validatingAirlineCodes?.[0];
                const flightDepartureDate = flight.itineraries[0].segments[0].departure.at.slice(0, 10); // YYYY-MM-DD format
                const flightDepartureTime = flight.itineraries[0].segments[0].departure.at.slice(11, 16); // HH:mm format
    
                // Check required fields
                const matchesOrigin = flightOrigin === origin;
                const matchesDestination = flightDestination === destination;
                const matchesDate = flightDepartureDate === departureDate;
    
                // Check optional fields
                const matchesAirline = airlineCode ? flightAirlineCode === airlineCode : true;
                const matchesTime = departureTime ? flightDepartureTime === departureTime : true;
    
                return matchesOrigin && matchesDestination && matchesDate && matchesAirline && matchesTime;
            });
    
            setResults(filteredResults);
        } catch (error) {
            console.error('Error fetching flight data:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    
    

    const handleBooking = async (flight) => {
        try {
            const touristId = localStorage.getItem("userId");
            const response = await axios.post(`http://localhost:8000/home/tourist/bookFlight`, {
                touristId,
                flight: {
                    flightNumber: flight.id,
                    airline: flight.validatingAirlineCodes?.[0],
                    departure: flight.itineraries?.[0].segments?.[0].departure.iataCode,
                    arrival: flight.itineraries?.[0].segments?.[0].arrival.iataCode,
                    date: flight.itineraries?.[0].segments?.[0].departure.at,
                    price: flight.price?.total,
                    currency: flight.price?.currency,
                },
            });

            if (response.status === 200) {
                alert('Flight booked successfully!');
            } else {
                alert('Failed to book the flight. Please try again.');
            }
        } catch (error) {
            console.error("Error booking flight:", error);
            alert("Error booking flight. Please try again later.");
        }
    };

    return (
        <div >
            <h1>Flight Search</h1>
            <div>
                <label htmlFor="origin">Origin (e.g., CAI)</label>
                <input
                    id="origin"
                    type="text"
                    placeholder="Origin (e.g., CAI)"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                />
            </div>
            <div>
                <label htmlFor="destination">Destination (e.g., ZRH)</label>
                <input
                    id="destination"
                    type="text"
                    placeholder="Destination (e.g., ZRH)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value.toUpperCase())}
                />
            </div>
            <div>
                <label htmlFor="departureDate">Departure Date</label>
                <input
                    id="departureDate"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                />
            </div>
            <div>
    <label htmlFor="airlineCode">Airline Code (optional)</label>
    <input
        id="airlineCode"
        type="text"
        placeholder="Airline Code (e.g., AA)"
        value={airlineCode}
        onChange={(e) => setAirlineCode(e.target.value.toUpperCase())}
    />
</div>
<div>
    <label htmlFor="departureTime">Departure Time (optional)</label>
    <input
        id="departureTime"
        type="time"
        value={departureTime}
        onChange={(e) => setDepartureTime(e.target.value)}
    />
</div>

            <button onClick={searchFlights} disabled={loading}>
                {loading ? 'Searching...' : 'Search Flights'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {results.length > 0 && (
                <div>
                    <h2>Flight Results</h2>
                    {results.map((flight, index) => (
                        <div key={index}>
                            <p>
                                Airline: {flight.validatingAirlineCodes?.[0]} <br />
                                Departure: {flight.itineraries?.[0].segments?.[0].departure.iataCode} <br />
                                Arrival: {flight.itineraries?.[0].segments?.[0].arrival.iataCode} <br />
                                Date: {flight.itineraries?.[0].segments?.[0].departure.at} <br />
                                Price: {flight.price?.total} {flight.price?.currency}<br />
                                Number of Bookable Seats: {flight.numberOfBookableSeats}
                            </p>
                            <button onClick={() => handleBooking(flight)}>Book Flight</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlightSearch;
