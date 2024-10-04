import React, { useState, useEffect } from 'react';
import '../DeleteUsers.css';
import { deleteTourGuide } from '../services/TGuideService';
import { deleteAdver } from '../services/AdverService';
import { deleteSeller } from '../services/SellerService'; // Import seller delete service
import { deleteTourist } from '../services/TouristService'; // Import tourist delete service

const TourGuideComponent = () => {
    const [tourGuides, setTourGuides] = useState([]);
    const [advertisers, setAdvertisers] = useState([]);
    const [sellers, setSellers] = useState([]); // State for sellers
    const [tourists, setTourists] = useState([]); // State for tourists
    const [message, setMessage] = useState('');

    // Fetch all tour guides from the backend
    const fetchTourGuides = async () => {
        try {
            const response = await fetch('http://localhost:8000/TourGuide/get');
            const data = await response.json();
            setTourGuides(data);
        } catch (error) {
            console.error("Error fetching Tour Guides:", error);
            setMessage('Error fetching Tour Guide list.');
        }
    };

    // Fetch all advertisers from the backend
    const fetchAdvertisers = async () => {
        try {
            const response = await fetch('http://localhost:8000/Advertiser/get');
            const data = await response.json();
            setAdvertisers(data);
        } catch (error) {
            console.error("Error fetching Advertisers:", error);
            setMessage('Error fetching Advertiser list.');
        }
    };

    // Fetch all sellers from the backend
    const fetchSellers = async () => {
        try {
            const response = await fetch('http://localhost:8000/Seller/get');
            const data = await response.json();
            setSellers(data);
        } catch (error) {
            console.error("Error fetching Sellers:", error);
            setMessage('Error fetching Seller list.');
        }
    };

    // Fetch all tourists from the backend
    const fetchTourists = async () => {
        try {
            const response = await fetch('http://localhost:8000/Tourist/get');
            const data = await response.json();
            setTourists(data);
        } catch (error) {
            console.error("Error fetching Tourists:", error);
            setMessage('Error fetching Tourist list.');
        }
    };

    // Handle deletion of a tour guide
    const handleDeleteTourGuide = async (id) => {
        try {
            await deleteTourGuide(id);
            setMessage('Tour Guide deleted successfully!');
            fetchTourGuides();
        } catch (error) {
            setMessage('Error deleting Tour Guide. Please try again.');
            console.error("Error deleting Tour Guide:", error);
        }
    };

    // Handle deletion of an advertiser
    const handleDeleteAdver = async (id) => {
        try {
            await deleteAdver(id);
            setMessage('Advertiser deleted successfully!');
            fetchAdvertisers();
        } catch (error) {
            setMessage('Error deleting Advertiser. Please try again.');
            console.error("Error deleting Advertiser:", error);
        }
    };

    // Handle deletion of a seller
    const handleDeleteSeller = async (id) => {
        try {
            await deleteSeller(id);
            setMessage('Seller deleted successfully!');
            fetchSellers();
        } catch (error) {
            setMessage('Error deleting Seller. Please try again.');
            console.error("Error deleting Seller:", error);
        }
    };

    // Handle deletion of a tourist
    const handleDeleteTourist = async (id) => {
        try {
            await deleteTourist(id);
            setMessage('Tourist deleted successfully!');
            fetchTourists();
        } catch (error) {
            setMessage('Error deleting Tourist. Please try again.');
            console.error("Error deleting Tourist:", error);
        }
    };

    // Fetch the lists when the component is first rendered
    useEffect(() => {
        fetchTourGuides();
        fetchAdvertisers();
        fetchSellers();
        fetchTourists(); // Fetch tourists
    }, []);

    return (
        <div>
            <h2>Manage Tour Guides, Advertisers, Sellers, and Tourists</h2>
            {message && <p>{message}</p>}

            {/* Tour Guide Box */}
            <div className="list-box">
                <h3>Tour Guide List</h3>
                <ul>
                    {tourGuides.map((guide) => (
                        <li key={guide._id}>
                            {guide.Name}
                            <button onClick={() => handleDeleteTourGuide(guide._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Advertiser Box */}
            <div className="list-box">
                <h3>Advertiser List</h3>
                <ul>
                    {advertisers.map((adver) => (
                        <li key={adver._id}>
                            {adver.Name}
                            <button onClick={() => handleDeleteAdver(adver._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Seller Box */}
            <div className="list-box">
                <h3>Seller List</h3>
                <ul>
                    {sellers.map((seller) => (
                        <li key={seller._id}>
                            {seller.Name}
                            <button onClick={() => handleDeleteSeller(seller._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tourist Box */}
            <div className="list-box">
                <h3>Tourist List</h3>
                <ul>
                    {tourists.map((tourist) => (
                        <li key={tourist._id}>
                            {tourist.UserName}
                            <button onClick={() => handleDeleteTourist(tourist._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TourGuideComponent;
