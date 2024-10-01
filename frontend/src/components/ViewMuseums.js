import React, { useState, useEffect } from 'react';
import '../App.css'; // Assuming you have a CSS file for styling
import { getMuseum } from '../services/MuseumService'; // Import the museum service function

const MuseumList = () => {
    const [museums, setMuseums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMuseums = async () => {
            try {
                const data = await getMuseum(); // Fetch museums from the backend
                setMuseums(data);
            } catch (err) {
                setError('Failed to fetch museums.');
            } finally {
                setLoading(false);
            }
        };

        fetchMuseums();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="museum-list">
            <h1>Museums</h1>
            <div className="museum-container">
                {museums.map(museum => (
                    <div className="museum-box" key={museum._id}>
                        <p><strong>Description:</strong> {museum.description || 'No description available'}</p> {/* Description */}
                        <p><strong>Location:</strong> {museum.location || 'No location available'}</p> {/* Location */}
                        <p><strong>Opening Hours:</strong> {museum.openingHours || 'No opening hours available'}</p> {/* Opening hours */}
                        <p><strong>Ticket Price:</strong> {museum.ticketPrice ? `${museum.ticketPrice} $` : 'Ticket price not available'}</p> {/* Ticket price */}
                        
                        {/* Render picture (assuming URL or base64 string) */}
                        {museum.pictures ? (
                            <div>
                                <strong>Pictures:</strong>
                                <img src={museum.pictures} alt="Museum" style={{ width: '100%', height: 'auto' }} />
                            </div>
                        ) : (
                            <p><strong>Pictures:</strong> No pictures available</p>
                        )}
                        
                        {/* You can add any other fields you have or want */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MuseumList;
