import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    getCategories,
    getAdvertiser,
    getActivityById,
    getTags,
  } from "../services/ActivityService";

const predefinedLocations = [
    {
        name: "Cairo, Egypt",
        coordinates: "31.2357,30.0444,31.2557,30.0644",
    },
    {
        name: "Giza Pyramids, Egypt",
        coordinates: "31.1313,29.9765,31.1513,29.9965",
    },
    {
        name: "Alexandria, Egypt",
        coordinates: "29.9097,31.2156,29.9297,31.2356",
    },
    {
        name: "German University in Cairo, Egypt",
        coordinates: "31.4486,29.9869,31.4686,30.0069",
    },
    {
        name: "Cairo Festival City, Egypt",
        coordinates: "31.4015,30.0254,31.4215,30.0454",
    },
];

const AdvertiserDetails = ({ selectedAdverId }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [advertiser, setAdvertiser] = useState(null);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [activities, setActivities] = useState([]);
    const [isEditingAdvertiser, setIsEditingAdvertiser] = useState(false);
    const [isEditingActivity, setIsEditingActivity] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState(null);
    const [advertiserFormData, setAdvertiserFormData] = useState({
        Name: '',
        Link: '',
        Hotline: '',
        Mail: '',
        Profile: '',
        Loc: '',
        CompanyDes: '',
        Services: '',
    });
    const [activityFormData, setActivityFormData] = useState({
        date: '',
        time: '',
        location: '',
        price: '',
        tags: '',
        specialDiscount: '',
        isBookingOpen: false,
    });
    const [showDetails, setShowDetails] = useState(false);
    const [showActivities, setShowActivities] = useState(false);

    useEffect(() => {
        const fetchAdvertiser = async () => {
            try {
                if (selectedAdverId) {
                    const response = await axios.get(`http://localhost:8000/home/adver/getadver/${selectedAdverId}`);
                    setAdvertiser(response.data);
                    setAdvertiserFormData(response.data);
                } else {
                    setError("No Advertiser ID provided.");
                }
            } catch (err) {
                console.error("Error fetching advertiser:", err);
                setError("Error fetching advertiser data.");
            }
        };
        

        fetchAdvertiser();
        fetchTags();
        fetchCategories();
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

    const fetchTags = async () => {
        try {
          const data = await getTags();
          setTags(data);
          console.log('tagss data', data);
        } catch (error) {
          console.error("Error fetching tags", error);
        }
      };
    
      const fetchCategories = async () => {
        try {
          const data = await getCategories();
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories", error);
        }
      };

    const handleAdvertiserChange = (e) => {
        setAdvertiserFormData({ ...advertiserFormData, [e.target.name]: e.target.value });
    };

    const handleActivityChange = (e) => {
        setActivityFormData({ ...activityFormData, [e.target.name]: e.target.value });
    };

    const handleAdvertiserSubmit = async (e) => {
        e.preventDefault();
        const { _selectedAdverId, ...updatedData } = advertiserFormData;

        try {
            const response = await axios.put(`http://localhost:8000/home/adver/updateadver/${selectedAdverId}`, updatedData);
            setAdvertiser(response.data);
            setIsEditingAdvertiser(false);
            console.log('Advertiser updated:', response.data);
        } catch (error) {
            console.error("Error updating advertiser:", error.response ? error.response.data : error.message);
            setError("Error updating advertiser.");
        }
    };

    const handleEditActivity = (activity) => {
        setActivityToEdit(activity);
        setActivityFormData({
            date: activity.date,
            time: activity.time,
            location: activity.location,
            price: activity.price,
            tags: activity.tags,
            specialDiscount: activity.specialDiscount,
            isBookingOpen: activity.isBookingOpen,
        });
        setIsEditingActivity(true);
    };

    const handleSaveActivity = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/activity/update/${activityToEdit._id}`, activityFormData);
            setActivities(activities.map(activity => (activity._id === response.data._id ? response.data : activity)));
            setIsEditingActivity(false);
            setActivityToEdit(null);
        } catch (error) {
            console.error("Error updating activity:", error.response ? error.response.data : error.message);
            setError("Error updating activity.");
        }
    };

    const handleDeleteActivity = async (activityId) => {
        if (window.confirm("Are you sure you want to delete this activity?")) {
            try {
                await axios.delete(`http://localhost:8000/activity/delete/${activityId}`);
                setActivities(activities.filter(activity => activity._id !== activityId));
                console.log('Activity deleted:', activityId);
            } catch (error) {
                console.error("Error deleting activity:", error.response ? error.response.data : error.message);
                setError("Error deleting activity.");
            }
        }
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

            <button onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "Hide Details" : "View Details"}
            </button>
            <button onClick={() => setIsEditingAdvertiser(!isEditingAdvertiser)}>
                {isEditingAdvertiser ? "Cancel Update Advertiser" : "Update Advertiser"}
            </button>
            <button onClick={() => fetchAdverActivities() && setShowActivities(!showActivities)}>
                {showActivities ? "Hide Activities" : "View Activities"}
            </button>
            <button onClick={() => navigate('/activities')}>Create Activities</button>

            {showDetails && (
                <div>
                    <h3>Details</h3>
                    <p><strong>Name:</strong> {advertiser.Name}</p>
                    <p><strong>Link:</strong> {advertiser.Link}</p>
                    <p><strong>Hotline:</strong> {advertiser.Hotline}</p>
                    <p><strong>Email:</strong> {advertiser.Mail}</p>
                    <p><strong>Profile:</strong> {advertiser.Profile}</p>
                    <p><strong>Location:</strong> {advertiser.Loc}</p>
                    <p><strong>Company Description:</strong> {advertiser.CompanyDes}</p>
                    <p><strong>Services:</strong> {advertiser.Services}</p>
                    <button onClick={() => setShowDetails(false)}>Close Details</button>
                </div>
            )}

            {isEditingAdvertiser && (
                <div>
                    <h3>Update Advertiser</h3>
                    <form onSubmit={handleAdvertiserSubmit}>
                        <div>
                            <label>Name:</label>
                            <input name="Name" value={advertiserFormData.Name} onChange={handleAdvertiserChange} required />
                        </div>
                        <div>
                            <label>Link:</label>
                            <input name="Link" value={advertiserFormData.Link} onChange={handleAdvertiserChange} required />
                        </div>
                        <div>
                            <label>Hotline:</label>
                            <input name="Hotline" value={advertiserFormData.Hotline} onChange={handleAdvertiserChange} required />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input name="Mail" value={advertiserFormData.Mail} onChange={handleAdvertiserChange} required />
                        </div>
                        <div>
                            <label>Profile:</label>
                            <input name="Profile" value={advertiserFormData.Profile} onChange={handleAdvertiserChange} required />
                        </div>
                        <div>
                            <label>Location:</label>
                            <input name="Loc" value={advertiserFormData.Loc} onChange={handleAdvertiserChange} required />
                        </div>
                        <div>
                            <label>Company Description:</label>
                            <textarea name="CompanyDes" value={advertiserFormData.CompanyDes} onChange={handleAdvertiserChange} required />
                        </div>
                        <div>
                            <label>Services:</label>
                            <textarea name="Services" value={advertiserFormData.Services} onChange={handleAdvertiserChange} required />
                        </div>
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setIsEditingAdvertiser(false)}>Cancel</button>
                    </form>
                </div>
            )}

            {showActivities && (
                <div className="activities-container">
                    <h3>Activities</h3>
                    <div className="activities-list">
                        {activities.length > 0 ? (
                            activities.map(activity => {
                                const locationData = predefinedLocations.find(
                                    (location) => location.name === activity.location
                                );
                                const mapSrc = locationData
                                    ? generateMapSrc(locationData.coordinates)
                                    : null;

                                    const category = categories.find(cat => cat._id === activity.category);
                                    const categoryName = category ? category.name : "Unknown Category";

                                    const tt = tags.find(t => t._id === activity.tags);
                                    const ttname = tt ? tt.name : "unknown tag";

                                return (
                                    <div key={activity._id} className="activity-card">
                                        <h4>{categoryName}</h4>
                                        <h3>{activity.advertiser.Name}</h3>
                                        <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> {activity.time}</p>
                                        <p><strong>Location:</strong> {activity.location}</p>
                                        <p><strong>Price:</strong> ${activity.price}</p>
                                        <p><strong>Tags:</strong> {ttname}</p>
                                        <p><strong>Special Discount:</strong> {activity.specialDiscount}%</p>
                                        <p><strong>Booking Open:</strong> {activity.isBookingOpen ? 'Yes' : 'No'}</p>
                                        {mapSrc && (
                                            <iframe
                                                title={`Map for ${activity.location}`}
                                                src={mapSrc}
                                                width="300"
                                                height="200"
                                                style={{ border: "none" }}
                                            ></iframe>
                                        )}
                                        <button onClick={() => handleEditActivity(activity)}>Edit</button>
                                        <button onClick={() => handleDeleteActivity(activity._id)}>Delete</button>
                                        <hr style={{ margin: '20px 0' }} /> {/* Separator */}
                                    </div>
                                );
                            })
                        ) : (
                            <p>No activities found for this advertiser.</p>
                        )}
                    </div>
                    <button onClick={() => setShowActivities(false)}>Close Activities</button>
                </div>
            )}

            {isEditingActivity && activityToEdit && (
                <div className="activity-edit-form">
                    <h3>Edit Activity</h3>
                    <form onSubmit={handleSaveActivity}>
                        <div>
                            <label>Date:</label>
                            <input 
                                name="date" 
                                type="date" 
                                value={activityFormData.date} 
                                onChange={handleActivityChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Time:</label>
                            <input 
                                name="time" 
                                type="time" 
                                value={activityFormData.time} 
                                onChange={handleActivityChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Location:</label>
                            <input 
                                name="location" 
                                value={activityFormData.location} 
                                onChange={handleActivityChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input 
                                name="price" 
                                type="number" 
                                value={activityFormData.price} 
                                onChange={handleActivityChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Tags:</label>
                            <input 
                                name="tags" 
                                value={activityFormData.tags} 
                                onChange={handleActivityChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Special Discount:</label>
                            <input 
                                name="specialDiscount" 
                                type="number" 
                                value={activityFormData.specialDiscount} 
                                onChange={handleActivityChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Booking Open:</label>
                            <select 
                                name="isBookingOpen" 
                                value={activityFormData.isBookingOpen} 
                                onChange={handleActivityChange} 
                                required
                            >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>
                        <button type="submit">Save Activity</button>
                        <button type="button" onClick={() => setIsEditingActivity(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdvertiserDetails;
