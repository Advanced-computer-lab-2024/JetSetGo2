import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SellerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const [Seller, setSeller] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    PickUp_Location: '',
    Type_Of_Products: '',
    Previous_Work: '',
    Age: '',
    Email: ''
  });
  const [selectedSection, setSelectedSection] = useState(''); // Track selected section
  const [notification, setNotification] = useState(''); // For success or error messages

  // Styling for the container and layout
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f7f8fa',
    padding: '20px',
  };

  const sidebarStyle = {
    width: '250px',
    padding: '20px',
    backgroundColor: '#2d3e50',
    borderRadius: '10px',
    color: '#fff',
  };

  const mainContentStyle = {
    flex: 1,
    marginLeft: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#ff6348',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
    width: '100%',
    fontSize: '16px',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2d3e50',
    color: '#fff',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: '0',
    margin: '20px 0',
  };

  const listItemStyle = {
    marginBottom: '10px',
    fontSize: '18px',
    color: '#333',
  };

  const notificationStyle = {
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    backgroundColor: notification.includes('success') ? '#28a745' : '#dc3545',
    color: '#fff',
    textAlign: 'center',
    fontSize: '18px',
  };

  const errorStyle = {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const loadingStyle = {
    textAlign: 'center',
    fontSize: '18px',
    color: '#333',
  };

  // Fetch Seller data
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

    if (id) fetchSeller();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id, ...updatedData } = formData;

    try {
      const response = await axios.put(`http://localhost:8000/Seller/updateSeller/${id}`, updatedData);
      setSeller(response.data);
      setIsEditing(false);
      setNotification('Seller updated successfully!'); // Set success notification
      setTimeout(() => {
        setNotification(''); // Clear notification after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error updating Seller:", error.response ? error.response.data : error.message);
      setError("Error updating Seller.");
      setNotification('Error updating Seller.'); // Set error notification
      setTimeout(() => {
        setNotification(''); // Clear notification after 3 seconds
      }, 3000);
    }
  };

  const handleSidebarClick = (section) => {
    setSelectedSection(section);
  };

  const renderDetails = () => (
    <ul style={listStyle}>
      <li style={listItemStyle}><strong>Name:</strong> {Seller.Name}</li>
      <li style={listItemStyle}><strong>Pick Up Location:</strong> {Seller.PickUp_Location}</li>
      <li style={listItemStyle}><strong>Type of Products:</strong> {Seller.Type_Of_Products}</li>
      <li style={listItemStyle}><strong>Previous Work:</strong> {Seller.Previous_Work}</li>
      <li style={listItemStyle}><strong>Age:</strong> {Seller.Age}</li>
      <li style={listItemStyle}><strong>Email:</strong> {Seller.Email}</li>
    </ul>
  );

  const renderEditForm = () => (
    <form onSubmit={handleSubmit}>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Name:</label>
        <input style={inputStyle} name="Name" value={formData.Name} onChange={handleChange} required />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Pick Up Location:</label>
        <input style={inputStyle} name="PickUp_Location" value={formData.PickUp_Location} onChange={handleChange} required />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Type of Products:</label>
        <input style={inputStyle} name="Type_Of_Products" value={formData.Type_Of_Products} onChange={handleChange} required />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Previous Work:</label>
        <input style={inputStyle} name="Previous_Work" value={formData.Previous_Work} onChange={handleChange} required />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Age:</label>
        <input style={inputStyle} name="Age" type="number" value={formData.Age} onChange={handleChange} required />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Email:</label>
        <input style={inputStyle} name="Email" value={formData.Email} onChange={handleChange} required />
      </div>
      <div>
        <button type="submit" style={buttonStyle}>Update</button>
        <button type="button" onClick={() => handleSidebarClick('details')} style={cancelButtonStyle}>Cancel</button>
      </div>
    </form>
  );

  const renderNoContent = () => (
    <div style={loadingStyle}>
      <p>Select an option from the sidebar to load content.</p>
    </div>
  );

  if (error) return <div style={errorStyle}>{error}</div>;
  if (!Seller && selectedSection) return <div style={loadingStyle}>Loading...</div>;

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3>        Welcome   </h3>
        <button onClick={() => handleSidebarClick('details')} style={buttonStyle}>
          View Details
        </button>
        <button onClick={() => handleSidebarClick('edit')} style={buttonStyle}>
          Edit Details
        </button>
        <button style={buttonStyle} onClick={() => navigate("/productList")}>View Products</button>
        <button style={buttonStyle} onClick={() => navigate("/product")}>Add/Edit Product</button>
      </div>

      {/* Main content */}
      <div style={mainContentStyle}>
        <h2 style={headerStyle}>Seller Details</h2>
        {notification && <div style={notificationStyle}>{notification}</div>}
        {selectedSection === 'edit' ? renderEditForm() : selectedSection === 'details' ? renderDetails() : renderNoContent()}
      </div>
    </div>
  );
};

export default SellerDetails;
