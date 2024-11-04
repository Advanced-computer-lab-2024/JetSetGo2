import React, { useState } from 'react';
import axios from 'axios';

const FlightSearch = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to get the Bearer token
    const getBearerToken = async () => {
        try {
            const client_id = 'LYT4JF7n7vkYqq6pYNDUMbOBDFSA7ieh';
            const client_secret = 'oGEoeufzY0Miwu4n';

            // Construct URL-encoded form data
            const data = new URLSearchParams();
            data.append('grant_type', 'client_credentials');
            data.append('client_id', client_id);
            data.append('client_secret', client_secret);

            const response = await axios.post(
                'https://test.api.amadeus.com/v1/security/oauth2/token',
                data,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            return response.data.access_token;
        } catch (error) {
            console.error('Error fetching Bearer token:', error);
            throw error;
        }
    };

    // Function to search for flights
    const searchFlights = async () => {
        setLoading(true);
        setError(null); // Reset error state

        try {
            const token = await getBearerToken();
            const response = await axios.get(
                'https://test.api.amadeus.com/v2/shopping/flight-offers',
                {
                    params: {
                        originLocationCode: origin,
                        destinationLocationCode: destination,
                        departureDate: departureDate,
                        adults: 1,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Filter the results to only include flights that match the origin and destination
            const filteredResults = response.data.data.filter(flight => {
                const flightOrigin = flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode;
                const flightDestination = flight.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode;
                return flightOrigin === origin && flightDestination === destination;
            });

            setResults(filteredResults);
        } catch (error) {
            console.error('Error fetching flight data:', error);
            setError('Failed to fetch flight data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Flight Search</h1>
            <div>
                <label htmlFor="origin">Origin (e.g., CAI)</label>
                <input
                    id="origin"
                    type="text"
                    placeholder="Origin (e.g., CAI)"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="destination">Destination (e.g., ZRH)</label>
                <input
                    id="destination"
                    type="text"
                    placeholder="Destination (e.g., ZRH)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
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
            <button onClick={searchFlights} disabled={loading}>
                {loading ? 'Searching...' : 'Search Flights'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {results.length > 0 && (
                <div>
                    <h2>Flight Results</h2>
                    {results.map((flight, index) => (
                        <div key={index}>
                            {/* Customize this based on the response structure */}
                            <p>
                                Airline: {flight.validatingAirlineCodes?.[0]} <br />
                                Departure: {flight.itineraries?.[0].segments?.[0].departure.iataCode} <br />
                                Arrival: {flight.itineraries?.[0].segments?.[0].arrival.iataCode} <br />
                                Price: {flight.price?.total} {flight.price?.currency}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlightSearch;
