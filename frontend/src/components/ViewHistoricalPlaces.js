import React, { useState, useEffect } from 'react';
import '../App.css'; // Assuming you want to use the same CSS styles
import { getHistoricalPlace } from '../services/HistoricalPlaceService'; // Import the historical place service function

const HistoricalPlaceList = () => {
    const [historicalPlaces, setHistoricalPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistoricalPlaces = async () => {
            try {
                const data = await getHistoricalPlace(); // Fetch historical places from the backend
                setHistoricalPlaces(data);
            } catch (err) {
                setError('Failed to fetch historical places.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistoricalPlaces();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="museum-list"> {/* You can change this to historical-place-list if you want */}
            <h1>Historical Places</h1>
            <div className="museum-container"> {/* Change className to historical-container if needed */}
                {historicalPlaces.map(place => (
                    <div className="museum-box" key={place._id}> {/* Change className to historical-box if needed */}
                        <h2>{place.description || 'Unnamed Place'}</h2>
                        <p><strong>Location:</strong> {place.location || 'No location available'}</p>
                        <p><strong>Opening Hours:</strong> {place.openingHours || 'No opening hours available'}</p>
                        <p><strong>Price:</strong> {place.ticketPrice ? `${place.ticketPrice} $` : 'Price not available'}</p>
                        {/* Add any other fields you have in your historical place schema */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoricalPlaceList;
