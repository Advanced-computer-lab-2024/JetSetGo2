import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from './logoo444.JPG';
import "./TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 

const TourGuidePage = () => {
  const navigate = useNavigate();
  const [tourGuide, setTourGuide] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Details");
  const [formData, setFormData] = useState({
    UserName: "",
    Password: "",
    Email: "",
    Age: "",
    LanguagesSpoken: "",
    MobileNumber: "",
    YearsOfExperience: "",
    PreviousWork: "",
    Photo: "", // State to hold the photo file
  });
  const [notification, setNotification] = useState("");

  const userId = localStorage.getItem("userId"); // Retrieve the Tour Guide ID from local storage

  useEffect(() => {
    const fetchTourGuide = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `http://localhost:8000/TourGuide/users/${userId}`
          );
          setTourGuide(response.data);
          setFormData(response.data); // Populate form with fetched data
        } else {
          alert("No Tour Guide ID found in local storage.");
        }
      } catch (err) {
        console.error("Error fetching tour guide:", err);
        setError("Error fetching tour guide data.");
      }
    };

    fetchTourGuide();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, Photo: e.target.files[0] });
  };

  const handleSchemaTourFrontPage = () => {
    navigate("/SchemaTourFront");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Photo, ...updatedData } = formData; // Separate the photo file from the rest of the form data

    const formDataToSend = new FormData();
    if (Photo) {
      formDataToSend.append("Photo", Photo);
    }

    // Append the other form data fields
    Object.keys(updatedData).forEach((key) => {
      formDataToSend.append(key, updatedData[key]);
    });

    try {
      const response = await axios.put(
        `http://localhost:8000/TourGuide/update/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTourGuide(response.data); // Update the local state with the updated tour guide data
      setIsEditing(false); // Exit the edit mode
      alert("Tour guide details updated successfully!");
    } catch (error) {
      console.error(
        "Error updating tour guide:",
        error.response ? error.response.data : error.message
      );
      setError("Error updating tour guide.");
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

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/TourGuide/deletMyAccount/${userId}`
        );

        if (response.status === 200) {
          alert(response.data.message); // Display success message
          navigate("/login"); // Redirect to homepage or login after deletion
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message); // Display error message from backend
        } else {
          alert("An error occurred while deleting the account.");
        }
      }
    }
  };

  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  const handleRevenuePage = () => {
    navigate("/revenue");
  };

  const handleCancel = () => {
    setIsEditing(false); // Exit edit mode without saving changes
  };

  if (error) return <div className="error">{error}</div>;
  if (!tourGuide) return <div className="loading">Loading...</div>;

  return (
    <div className="tour-guide-page">
      <Navbar className="navbar">
      <Container>
        
        <Navbar.Brand href="#" className="navbar-brand">
          {/* Replace with your logo */}
          <img src={img1} alt="Logo" className="navbar-logo" />
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Link to="/Upcoming-activities" className="nav-link">
            Activities
          </Link>
          <Link to="/Upcoming-itinerariestg" className="nav-link">
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
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-container">
          <img
            src={`data:image/png;base64,${tourGuide.Photo}`}
            alt="Product"
            className="profile-image"
          />
         <p className="profile-name">
  {tourGuide.UserName}
  <FaPen
    onClick={() => setIsEditing(true)}
    className="edit-icon"
    title="Edit Details"
    size={13} // Adjust the size as needed (e.g., 16px)
  />
</p>

          
          
          <button className="sidebar-button" onClick={handleLogout}>
            Logout
          </button>
          <button className="sidebar-button" onClick={handleRevenuePage} >
            Revenue Rep
          </button>
          <button
          onClick={() =>
            navigate("/TourReport", {
              state: { userId },
            })
          }
        >
          View Tourist Report
        </button>
          <button className="sidebar-button" onClick={handleLogout}>
            Logout
          </button> {/* Logout Button */}
          <button
            onClick={handleDeleteAccount}
            className="sidebar-button"
          >
            Delete Account
          </button>
        </div>
        <div className="sidebar-image-container">
          <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
        </div>
      </div>

      <div className="main-content">
  <h1 className="header">Tour Guide Details</h1>

  {notification && (
    <div className="notification">{notification}</div>
  )}

  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="tg">
    <Tab eventKey="details" title="Details">
    <div className="complaints-container">
  {isEditing ? (
    <Form onSubmit={handleSubmit} className="modern-form">
      <Form.Group className="mb-3">
        <Form.Label>UserName</Form.Label>
        <Form.Control
          type="text"
          name="UserName"
          value={formData.UserName}
          onChange={handleChange}
          placeholder="Enter your username"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Age</Form.Label>
        <Form.Control
          type="number"
          name="Age"
          value={formData.Age}
          onChange={handleChange}
          placeholder="Enter your age"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Languages Spoken</Form.Label>
        <Form.Control
          type="text"
          name="LanguagesSpoken"
          value={formData.LanguagesSpoken}
          onChange={handleChange}
          placeholder="Enter the languages you speak"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type="text"
          name="MobileNumber"
          value={formData.MobileNumber}
          onChange={handleChange}
          placeholder="Enter your mobile number"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Years of Experience</Form.Label>
        <Form.Control
          type="number"
          name="YearsOfExperience"
          value={formData.YearsOfExperience}
          onChange={handleChange}
          placeholder="Enter years of experience"
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Previous Work</Form.Label>
        <Form.Control
          type="text"
          name="PreviousWork"
          value={formData.PreviousWork}
          onChange={handleChange}
          placeholder="Enter your previous work experience"
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Upload Photo</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setFormData)}
        />
      </Form.Group>
      
      <div className="form-buttons">
        <Button type="submit" className="reply-button">
          Update
        </Button>
        <Button onClick={handleCancel} className="reply-button" >
          Cancel
        </Button>
      </div>
    </Form>
  ) : (
    <ul>
      <li><strong>UserName:</strong> {tourGuide.UserName}</li>
      <li><strong>Email:</strong> {tourGuide.Email}</li>
      <li><strong>Age:</strong> {tourGuide.Age}</li>
      <li><strong>Languages Spoken:</strong> {tourGuide.LanguagesSpoken}</li>
      <li><strong>Mobile Number:</strong> {tourGuide.MobileNumber}</li>
      <li><strong>Years of Experience:</strong> {tourGuide.YearsOfExperience}</li>
      <li><strong>Previous Work:</strong> {tourGuide.PreviousWork}</li>
      <li>
        <strong>Notifications:</strong>
        {tourGuide.Notifications && tourGuide.Notifications.length > 0 ? (
          <ul>
            {tourGuide.Notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        ) : (
          <p>No notifications</p>
        )}
      </li>
    </ul>
  )}
</div>

    </Tab>

    
  </Tabs>
</div>
{/* Right Sidebar */}
<div className="right-sidebar">
  <div className="sidebar-buttons">
    <button className="box" onClick={() => navigate("/SchemaTourFront")}>Create Itinerary</button>
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

export default TourGuidePage;
