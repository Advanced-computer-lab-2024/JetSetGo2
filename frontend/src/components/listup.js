import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AdvertiserDetails = () => {
    const location = useLocation();
    const id = location.state?.id; // Safely retrieve ID from state

    const [advertiser, setAdvertiser] = useState(null);
    const [error, setError] = useState(null);
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

    useEffect(() => {
        const fetchAdvertiser = async () => {
            try {
                if (id) {
                    const response = await axios.get(`http://localhost:8000/home/adver/getadver/${id}`);
                    setAdvertiser(response.data);
                    setFormData(response.data); // Set initial form data for editing
                } else {
                    setError("No Advertiser ID provided.");
                }
            } catch (err) {
                console.error("Error fetching advertiser:", err);
                setError("Error fetching advertiser data.");
            }
        };

        fetchAdvertiser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create an object without the ID
        const { ...updatedData } = formData; // Assuming the ID is in formData

        try {
            const response = await axios.put(`http://localhost:8000/home/adver/updateadver/${id}`, updatedData);
            console.log("Update response:", response.data);
            setAdvertiser(response.data); // Update local state with response
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error("Error updating advertiser:", error.response ? error.response.data : error.message);
            setError("Error updating advertiser.");
        }
    };

    if (error) return <div>{error}</div>;
    if (!advertiser) return <div>Loading...</div>;

    return (
        <div>
            <h2>Advertiser Details</h2>
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
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </ul>
            )}
        </div>
    );
};

export default AdvertiserDetails;
