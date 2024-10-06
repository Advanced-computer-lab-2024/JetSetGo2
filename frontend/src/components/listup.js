import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const predefinedLocations = [
    { name: 'Cairo, Egypt', coordinates: '31.2357,30.0444,31.2557,30.0644' },
    { name: 'Giza Pyramids, Egypt', coordinates: '31.1313,29.9765,31.1513,29.9965' },
    { name: 'Alexandria, Egypt', coordinates: '29.9097,31.2156,29.9297,31.2356' },
    { name: 'German University in Cairo, Egypt', coordinates: '31.4486,29.9869,31.4686,30.0069' },
    { name: 'Cairo Festival City, Egypt', coordinates: '31.4015,30.0254,31.4215,30.0454' },
];

const AdvertiserDetails = ({ selectedAdverId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state?.id;

    const [advertiser, setAdvertiser] = useState(null);
    const [error, setError] = useState(null);
    const [activities, setActivities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        Link: '',
        Hotline: '',
        Mail: '',
        Profile: '',
        Loc: '',
        CompanyDes: '',
        Services: '',
    });
    const [showDetails, setShowDetails] = useState(false);
    const [showActivities, setShowActivities] = useState(false);

    useEffect(() => {
        const fetchAdvertiser = async () => {
            try {
                if (selectedAdverId) {
                    const response = await axios.get(`http://localhost:8000/home/adver/getadver/${selectedAdverId}`);
                    setAdvertiser(response.data);
                    setFormData(response.data);
                } else {
                    setError("No Advertiser ID provided.");
                }
            } catch (err) {
                console.error("Error fetching advertiser:", err);
                setError("Error fetching advertiser data.");
            }
        };

        fetchAdvertiser();
    }, [selectedAdverId]);

    const fetchAdverActivities = async () => {
        if (!selectedAdverId) {
            console.error("No Advertiser ID provided for fetching activities.");
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8000/activity/getAdverAct?userId=${selectedAdverId}`);
            setActivities(response.data);
            console.log("Fetched activities:", response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setError('Failed to fetch activities.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { _selectedAdverId, ...updatedData } = formData;

        try {
            const response = await axios.put(`http://localhost:8000/home/adver/updateadver/${selectedAdverId}`, updatedData);
            setAdvertiser(response.data);
            setIsEditing(false);
            console.log('eee = ', response.data);
        } catch (error) {
            console.error("Error updating advertiser:", error.response ? error.response.data : error.message);
            setError("Error updating advertiser.");
        }
    };

    const handleViewDetails = () => {
        setShowDetails(!showDetails);
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowDetails(true);
    };

    const handleClose = () => {
        setShowDetails(false);
    };

    const handleViewActivities = () => {
        fetchAdverActivities();
        setShowActivities(!showActivities);
        setShowDetails(false);
    };

    const handleCreateActivities = () => {
        navigate('/activities');
        
        console.log('addddv = ',advertiser );
    };

    const generateMapSrc = (coordinates) => {
        const [long1, lat1, long2, lat2] = coordinates.split(',');
        return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
    };

    if (error) return <div>{error}</div>;
    if (!advertiser) return <div>Loading...</div>;

    return (
        <div className="advertiser-details">
            <h2>Advertiser Details</h2>

            <button onClick={handleViewDetails}>View Details</button>
            <button onClick={handleEdit} disabled={isEditing || !showDetails}>Update</button>
            <button onClick={handleViewActivities}>View Activities</button>
            <button onClick={handleCreateActivities}>Create Activities</button>

            {showDetails && (
                <>
                    <button onClick={handleClose}>Close</button>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input name="Name" value={formData.Name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Link:</label>
                                <input name="Link" value={formData.Link} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Hotline:</label>
                                <input name="Hotline" value={formData.Hotline} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input name="Mail" value={formData.Mail} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Profile:</label>
                                <input name="Profile" value={formData.Profile} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Location:</label>
                                <input name="Loc" value={formData.Loc} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Company Description:</label>
                                <textarea name="CompanyDes" value={formData.CompanyDes} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Services:</label>
                                <textarea name="Services" value={formData.Services} onChange={handleChange} required />
                            </div>
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </form>
                    ) : (
                        <ul>
                            <li><strong>Name:</strong> {advertiser.Name}</li>
                            <li><strong>Link:</strong> {advertiser.Link}</li>
                            <li><strong>Hotline:</strong> {advertiser.Hotline}</li>
                            <li><strong>Email:</strong> {advertiser.Mail}</li>
                            <li><strong>Profile:</strong> {advertiser.Profile}</li>
                            <li><strong>Location:</strong> {advertiser.Loc}</li>
                            <li><strong>Company Description:</strong> {advertiser.CompanyDes || 'N/A'}</li>
                            <li><strong>Services:</strong> {advertiser.Services || 'N/A'}</li>
                        </ul>
                    )}
                </>
            )}

            {showActivities && (
                <div className="activities-container">
                    <h3>Activities</h3>
                    <div className="activities-list">
                        {activities.length > 0 ? (
                            activities.map(activity => {
                                const locationData = predefinedLocations.find(
                                    location => location.name === activity.location
                                );
                                const mapSrc = locationData
                                    ? generateMapSrc(locationData.coordinates)
                                    : null;

                                return (
                                    <div key={activity._id} className="activity-card">
                                        <h4>{activity.category.name}</h4>
                                        <h4>{advertiser.Name}</h4>
                                        <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> {activity.time}</p>
                                        <p><strong>Location:</strong> {activity.location}</p>
                                        <p><strong>Price:</strong> ${activity.price}</p>
                                        <p><strong>Tags:</strong> {activity.tags}</p>
                                        <p><strong>Special Discount:</strong> {activity.specialDiscount}%</p>
                                        <p><strong>Booking Open:</strong> {activity.isBookingOpen ? 'Yes' : 'No'}</p>
                                        {mapSrc && (
                                            <iframe
                                                title={`Map for ${activity.location}`}
                                                src={mapSrc}
                                                width="300"
                                                height="200"
                                                style={{ border: 'none' }}
                                            />
                                        )}
                                        <hr />
                                    </div>
                                );
                            })
                        ) : (
                            <p>No activities found for this advertiser.</p>
                        )}
                    </div>
                    <button onClick={handleViewActivities}>Close Activities</button>
                </div>
            )}
        </div>
    );
};

export default AdvertiserDetails;