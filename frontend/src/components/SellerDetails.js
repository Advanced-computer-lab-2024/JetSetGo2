import React, { useEffect, useState } from "react";
import { useLocation,Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from './logoo444.JPG';
import "./SellerPage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 

const SellerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const [Seller, setSeller] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Fix the state definition
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Name: "",
    Password: "",
    PickUp_Location: "",
    Type_Of_Products: "",
    Previous_Work: "",
    Age: "",
  });
  const [selectedSection, setSelectedSection] = useState("details"); // Default to details
  const [notification, setNotification] = useState(""); // For success or error messages

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f7f8fa",
    padding: "20px",
  };

  const sidebarStyle = {
    width: "250px",
    padding: "20px",
    //backgroundColor: "#2d3e50",
    borderRadius: "10px",
    color: "#fff",
    position: "relative",
  };

  const avatarStyle = {
    width: "100px", // Adjust width as needed
    height: "100px", // Adjust height as needed
    borderRadius: "50%", // Make it circular
    marginBottom: "20px", // Adds space below the image
  };
  const usernameStyle = {
    marginTop: "20px", // Adds space above the username (alternative to marginBottom in avatarStyle)
  };

  const mainContentStyle = {
    flex: 1,
    marginLeft: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle = {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  };

  const buttonStyle = {
    background: '#2a2737', // Matches sidebar button background
    color: '#fff', // Matches sidebar button text color
    padding: '10px 400px', // Matches sidebar button padding
    borderRadius: '10px', // Matches sidebar button border radius
    border: 'none', // Matches sidebar button border
    cursor: 'pointer',
    fontSize: '16px', // Matches sidebar button font size
    fontFamily: "'Roboto', sans-serif", // Matches sidebar button font family
    transition: 'background-color 0.3s ease, transform 0.3s ease', // Matches sidebar button transitions
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'nowrap', // Prevents wrapping of text
    marginTop: '10px',
  };
  const buttonStyle1 = {
    background: '#2a2737', // Matches sidebar button background
    color: '#fff', // Matches sidebar button text color
    padding: '10px 427px', // Matches sidebar button padding
    borderRadius: '10px', // Matches sidebar button border radius
    border: 'none', // Matches sidebar button border
    cursor: 'pointer',
    fontSize: '16px', // Matches sidebar button font size
    fontFamily: "'Roboto', sans-serif", // Matches sidebar button font family
    transition: 'background-color 0.3s ease, transform 0.3s ease', // Matches sidebar button transitions
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'nowrap', // Prevents wrapping of text
    marginTop: '10px',
  };
  
  const cancelButtonStyle = {
    ...buttonStyle, // Inherit all styles from buttonStyle
    background: '#666278', // Use a different color for cancel button
    color: '#fff',
  };
  

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const listStyle = {
    listStyleType: "none",
    padding: "0",
    margin: "20px 0",
  };

  const listItemStyle = {
    marginBottom: "10px",
    fontSize: "18px",
    color: "#333",
  };

  const notificationStyle = {
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "4px",
    backgroundColor: notification.includes("success") ? "#28a745" : "#dc3545",
    color: "#fff",
    textAlign: "center",
    fontSize: "18px",
  };

  const errorStyle = {
    color: "red",
    textAlign: "center",
    marginBottom: "20px",
  };

  const loadingStyle = {
    textAlign: "center",
    fontSize: "18px",
    color: "#333",
  };

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Retrieve userId from local storage
        if (userId) {
          const response = await axios.get(
            `http://localhost:8000/Seller/readSeller/${userId}`
          );
          setSeller(response.data);
          setFormData(response.data); // Set initial form data for editing
        } else {
          setError("No Seller ID found in local storage.");
        }
      } catch (err) {
        console.error("Error fetching Seller:", err);
        setError("Error fetching Seller.");
      }
    };

    fetchSeller(); // Call fetchSeller without dependency on location state
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { logoFile, ...updatedData } = formData;

    const formDataToSend = new FormData();
    if (logoFile) {
      formDataToSend.append("logoFile", logoFile); // Append logo file only if a new one is selected
    }
    Object.keys(updatedData).forEach((key) => {
      formDataToSend.append(key, updatedData[key]);
    });

    try {
      const userId = localStorage.getItem("userId"); // Retrieve userId from local storage
      const response = await axios.put(
        `http://localhost:8000/Seller/updateSeller/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSeller(response.data);
      setIsEditing(false);
      setNotification("Seller updated successfully!");
      setTimeout(() => {
        setNotification("");
      }, 3000); // Success notification will disappear after 3 seconds
    } catch (error) {
      console.error(
        "Error updating Seller:",
        error.response ? error.response.data : error.message
      );
      setError("Error updating Seller.");
    }
  };

  const handleSidebarClick = (section) => {
    setSelectedSection(section);
    if (section === "edit") {
      setIsEditing(true); // Set editing state when clicking on edit section
    } else {
      setIsEditing(false); // Reset editing state for other sections
    }
  };

  const handleImageUpload = (event, setData) => {
    const file = event.target.files[0];
    if (file) {
      // You might need to convert the image file to a URL or base64 format
      const reader = new FileReader();
      reader.onloadend = () => {
        // Assuming you want to store the image as a string URL
        setData((prevData) => ({
          ...prevData,
          pictures: reader.result, // Store the image URL in formData
        }));
        //setImagePreview(reader.result);
        //console.log(imagePreview);
        
      };
      reader.readAsDataURL(file); // Convert file to base64 URL
    }
  };
  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };
  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from local storage

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/Seller/deletMyAccount/${userId}`
        );

        if (response.status === 200) {
          alert(response.data.message); // Display success message
          navigate("/login"); // Redirect to homepage or login after deletion
        }
      } catch (error) {
        // Handle errors, such as when there are upcoming booked itineraries
        if (error.response && error.response.data.message) {
          alert(error.response.data.message); // Display error message from backend
        } else {
          alert("An error occurred while deleting the account.");
        }
      }
    }
  };

  const renderDetails = () => (
    <ul style={listStyle}>
      <li style={listItemStyle}>
        <strong>UserName:</strong> {Seller?.UserName || "N/A"}
      </li>
      <li style={listItemStyle}>
        <strong>Email:</strong> {Seller?.Email || "N/A"}
      </li>
      <li style={listItemStyle}>
        <strong>Name:</strong> {Seller?.Name || "N/A"}
      </li>
      <li style={listItemStyle}>
        <strong>Pick Up Location:</strong> {Seller?.PickUp_Location || "N/A"}
      </li>
      <li style={listItemStyle}>
        <strong>Type of Products:</strong> {Seller?.Type_Of_Products || "N/A"}
      </li>
      <li style={listItemStyle}>
        <strong>Previous Work:</strong> {Seller?.Previous_Work || "N/A"}
      </li>
      <li style={listItemStyle}>
        <strong>Age:</strong> {Seller?.Age || "N/A"}
      </li>
      {Seller?.logo && (
        <li style={listItemStyle}>
          <strong>Logo:</strong>{" "}
          <img
            src={`data:image/png;base64,${Seller.logo}`}
            alt="Logo"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </li>
      )}
    </ul>
  );
  
  const renderEditForm = () => (
    <form onSubmit={handleSubmit}>
      <div style={formGroupStyle}>
        <label style={labelStyle}>UserName:</label>
        <input
          style={inputStyle}
          name="UserName"
          value={formData.UserName || ""}
          onChange={handleChange}
          type="text"
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Email:</label>
        <input
          style={inputStyle}
          name="Email"
          value={formData.Email || ""}
          onChange={handleChange}
          type="email"
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Name:</label>
        <input
          style={inputStyle}
          name="Name"
          value={formData.Name || ""}
          onChange={handleChange}
          type="text"
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Password:</label>
        <input
          style={inputStyle}
          name="Password"
          value={formData.Password || ""}
          onChange={handleChange}
          type="password"
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Pick Up Location:</label>
        <input
          style={inputStyle}
          name="PickUp_Location"
          value={formData.PickUp_Location || ""}
          onChange={handleChange}
          type="text"
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Type of Products:</label>
        <input
          style={inputStyle}
          name="Type_Of_Products"
          value={formData.Type_Of_Products || ""}
          onChange={handleChange}
          type="text"
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Previous Work:</label>
        <input
          style={inputStyle}
          name="Previous_Work"
          value={formData.Previous_Work || ""}
          onChange={handleChange}
          type="text"
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Age:</label>
        <input
          style={inputStyle}
          name="Age"
          value={formData.Age || ""}
          onChange={handleChange}
          type="number"
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Logo:</label>
        <input
          style={inputStyle}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setFormData)}
          required
        />
      </div>
      <button style={buttonStyle} type="submit">
        Save Changes
      </button>
      <button
        style={buttonStyle1}
        type="button"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </form>
  );
  

  if (error) {
    return <div style={errorStyle}>{error}</div>; // Display error message
  }

  if (!Seller) {
    return <div style={loadingStyle}>Loading...</div>; // Display loading message
  }

  return (
    <div className="seller-page">
      <Navbar className="navbar1">
      <Container>
        
        <Navbar.Brand href="#" className="navbar-brand">
          {/* Replace with your logo */}
          <img src={img1} alt="Logo" className="navbar-logo" />
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Link to="/Upcoming-activities" className="nav-link">
            Activities
          </Link>
          <Link to="/Upcoming-itineraries" className="nav-link">
            Itineraries
          </Link>
          <Link to="/all-historicalplaces" className="nav-link">
            Historical Places
          </Link>
          <Link to="/all-museums" className="nav-link">
            Museums
          </Link>
        </Nav>
      </Container>
    </Navbar>
    <div className="seller-container">
      {/* Sidebar */}
      <div className="sidebar">
      <div className="profile-container">
        <img
          src={`data:image/png;base64,${Seller.logo}`}
          alt="Product"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        <h2>{Seller.UserName}</h2>
        <button
          className="sidebar-button"
          onClick={() => handleSidebarClick("details")}
        >
          View Details
        </button>
        <button className="sidebar-button" onClick={() => handleSidebarClick("edit")}>
          Edit Details
        </button>
        <button className="sidebar-button" onClick={handleLogout}>
            Logout
          </button> {/* Logout Button */}
        <button onClick={handleDeleteAccount} className="sidebar-button">
        Delete Account
      </button>
      </div>
      <div className="sidebar-image-container">
          <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
        </div>
      </div>
      <div style={mainContentStyle}>
  <h1 style={headerStyle}>
    {isEditing ? "Edit Seller" : "Seller Details"}
  </h1>

  {notification && (
    <div style={notificationStyle}>{notification}</div>
  )}

  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="seller">
    <Tab eventKey="details" title="Details">
      <div className="details-container">
        {isEditing ? renderEditForm() : renderDetails()}
      </div>
    </Tab>
  </Tabs>
</div>

      {/* Right Sidebar */}
<div className="right-sidebar">
  <div className="sidebar-buttons">
  <h3 style={{ color: "#ffffff", fontWeight: "bold", textAlign: "center" }}>Explore</h3>

        <button className="box" onClick={() => navigate("/productList")}>
          View Products
        </button>
        <button className="box" onClick={() => navigate("/product")}>
          Add/Edit Product
        </button>

       
        <button onClick={() => navigate("/SellerRevenue")} className="box">
  View Revenue
</button>
  </div>
</div>
    </div>
    
      {/* Footer */}
      <div className="footer">
        <Container>
          <Row>
            <Col md={4}>
              <h5>Contact Us</h5>
              <p>Email: contact@jetsetgo.com</p>
              <p>Phone: +123 456 7890</p>
            </Col>
            <Col md={4}>
              <h5>Address</h5>
              <p>123 Travel Road</p>
              <p>Adventure City, World 45678</p>
            </Col>
            <Col md={4}>
              <h5>Follow Us</h5>
              <p>Facebook | Twitter | Instagram</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};


export default SellerDetails;
