import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { deleteTourGuide } from '../services/TGuideService';
import { deleteAdver } from '../services/AdverService';
import { deleteSeller } from '../services/SellerService';
import { deleteTourist } from '../services/TouristService';

const TourGuideComponent = () => {
    const navigate = useNavigate();
    const [tourGuides, setTourGuides] = useState([]);
    const [advertisers, setAdvertisers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [tourists, setTourists] = useState([]);
    const [message, setMessage] = useState('');

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

    useEffect(() => {
        fetchTourGuides();
        fetchAdvertisers();
        fetchSellers();
        fetchTourists();
    }, []);

    // Button styles for admin navigation
    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#2d3e50',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, transform 0.3s',
        width: '180px',
        textAlign: 'center',
    };

    const handleHover = (e) => {
        e.target.style.backgroundColor = '#0056b3';
        e.target.style.transform = 'scale(1.05)';
    };

    const handleLeave = (e) => {
        e.target.style.backgroundColor = '#2d3e50';
        e.target.style.transform = 'scale(1)';
    };

    return (
        <div style={styles.container}>
            {/* Sidebar with Profile and Admin Buttons */}
            <div style={styles.sidebar}>
                <div style={styles.profileContainer}>
                    <img
                        src="https://i.pngimg.me/thumb/f/720/c3f2c592f9.jpg"
                        alt="Profile"
                        style={styles.profileImage}
                    />
                    <h2 style={styles.profileName}>Admin</h2>
                    <p>Admin</p>
                    <button onClick={() => navigate('/adminCapabilities')} style={styles.button}>
                        Admin Home
                    </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                    {[
                        { label: 'Manage Categories', path: '/category' },
                        { label: 'Manage Tags', path: '/TagsManagement' },
                        { label: 'Manage Products', path: '/product' },
                        { label: 'View Product List', path: '/productList' },
                        { label: 'Delete Users', path: '/DeleteUsers' },
                        { label: 'Add a Tourism Governor', path: '/AddTourismGovernor' },
                        { label: 'Add an Admin', path: '/AddAdmin' },
                    ].map((button) => (
                        <button
                            key={button.path}
                            style={buttonStyle}
                            onClick={() => navigate(button.path)}
                            onMouseEnter={handleHover}
                            onMouseLeave={handleLeave}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <h2 style={styles.header}>Manage Tour Guides, Advertisers, Sellers, and Tourists</h2>
                {message && <p style={styles.message}>{message}</p>}

                {/* Tour Guide Box */}
                <div style={styles.userBox}>
                    <h3 style={styles.listTitle}>Tour Guide List</h3>
                    <ul style={styles.userList}>
                        {tourGuides.map((guide) => (
                            <li key={guide._id} style={styles.listItem}>
                                <span>{guide.Name}</span>
                                <button
                                    style={styles.listButton}
                                    onClick={() => handleDeleteTourGuide(guide._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Advertiser Box */}
                <div style={styles.userBox}>
                    <h3 style={styles.listTitle}>Advertiser List</h3>
                    <ul style={styles.userList}>
                        {advertisers.map((adver) => (
                            <li key={adver._id} style={styles.listItem}>
                                <span>{adver.Name}</span>
                                <button
                                    style={styles.listButton}
                                    onClick={() => handleDeleteAdver(adver._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Seller Box */}
                <div style={styles.userBox}>
                    <h3 style={styles.listTitle}>Seller List</h3>
                    <ul style={styles.userList}>
                        {sellers.map((seller) => (
                            <li key={seller._id} style={styles.listItem}>
                                <span>{seller.Name}</span>
                                <button
                                    style={styles.listButton}
                                    onClick={() => handleDeleteSeller(seller._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tourist Box */}
                <div style={styles.userBox}>
                    <h3 style={styles.listTitle}>Tourist List</h3>
                    <ul style={styles.userList}>
                        {tourists.map((tourist) => (
                            <li key={tourist._id} style={styles.listItem}>
                                <span>{tourist.UserName}</span>
                                <button
                                    style={styles.listButton}
                                    onClick={() => handleDeleteTourist(tourist._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#2d3e50',
        padding: '20px',
        borderRadius: '10px',
        color: '#fff',
    },
    profileContainer: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    profileImage: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
    },
    profileName: {
        margin: '10px 0',
    },
    button: {
        marginTop: '10px',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    },
    mainContent: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        marginLeft: '20px',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    },
    header: {
        marginBottom: '20px',
        fontSize: '24px',
    },
    message: {
        color: 'green',
        marginBottom: '20px',
    },
    userBox: {
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    listTitle: {
        fontSize: '20px',
        marginBottom: '10px',
    },
    userList: {
        listStyleType: 'none',
        padding: '0',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    listButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    listButtonHover: {
        backgroundColor: '#c82333',
    },
};


export default TourGuideComponent;
