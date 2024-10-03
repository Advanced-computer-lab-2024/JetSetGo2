import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SellerDetails = () => {
    const location = useLocation();
    const id = location.state?.id; // Safely retrieve ID from state

    const [Seller, setSeller] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        Password: '',
        Description: '',
        Email: ''
        
    });

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                if (id) {
                    const response = await axios.get(`http://localhost:8000/Seller/readSeller/${id}`);
                    setSeller(response.data);
                    setFormData(response.data); // Set initial form data for editing
                } else {
                    setError("No Seller ID provided.");
                }
            } catch (err) {
                console.error("Error fetching Seller:", err);
                setError("Error fetching Seller.");
            }
        };

        fetchSeller();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create an object without the ID
        const { _id, ...updatedData } = formData; // Assuming the ID is in formData

        try {
            const response = await axios.put(`http://localhost:8000/Seller/updateSeller/${id}`, updatedData);
            console.log("Update response:", response.data);
            setSeller(response.data); // Update local state with response
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error("Error updating Seller:", error.response ? error.response.data : error.message);
            setError("Error updating Seller.");
        }
    };

    if (error) return <div>{error}</div>;
    if (!Seller) return <div>Loading...</div>;

    return (
        <div>
            <h2>Seller Details</h2>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input name="Name" value={formData.Name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input name="Password" value={formData.Passowrd} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input name="Description" value={formData.Description} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input name="Email" value={formData.LanguagesSpoken} onChange={handleChange} required />
                    </div>
                    
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <ul>
                    <li><strong>Name:</strong> {Seller.Name}</li>
                    <li><strong>Password:</strong> {Seller.Password}</li>
                    <li><strong>Description:</strong> {Seller.Description}</li>
                    <li><strong>Email:</strong> {Seller.Email}</li>
                    
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </ul>
            )}
        </div>
    );
};

export default SellerDetails;