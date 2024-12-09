import React, { useEffect, useState } from "react";
import { useLocation, useNavigate,Link } from "react-router-dom";
import axios from "axios";
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
import "../AdvertiserDetails.css"; // Import the updated styles
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 
import sidebarImage from './logoo444.JPG';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const AdvertiserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [advertiser, setAdvertiser] = useState(null);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isEditingAdvertiser, setIsEditingAdvertiser] = useState(false);
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [advertiserFormData, setAdvertiserFormData] = useState({
    UserName: "",
    Password: "",
    Link: "",
    Hotline: "",
    Email: "",
    Profile: "",
    Loc: "",
    CompanyDes: "",
    Services: "",
    logoFile: "", // State to hold the logo file
  });
  const [activityFormData, setActivityFormData] = useState({
    date: "",
    time: "",
    location: "",
    price: "",
    tags: "",
    specialDiscount: "",
    isBookingOpen: false,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  const adverId = localStorage.getItem("userId"); // Retrieve the Tour Guide ID from local storage

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        if (adverId) {
          const response = await axios.get(
            `http://localhost:8000/home/adver/getadver/${adverId}`
          );
          setAdvertiser(response.data);
          setAdvertiserFormData(response.data); // Populate form with fetched data
          console.log(advertiserFormData);
        } else {
          setError("No advertiser ID found in local storage.");
        }
      } catch (err) {
        console.error("Error fetching advertiser:", err);
        setError("Error fetching advertiser data.");
      }
    };

    fetchAdvertiser();
  }, [adverId]);

  const fetchAdverActivities = async () => {
    if (!userId) {
      console.error("No Advertiser ID provided for fetching activities.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8000/activity/getAdverAct?userId=${userId}`
      );
      setActivities(response.data);
      console.log("Fetched activities:", response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities.");
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
      console.log("Tags data", data);
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
    setAdvertiserFormData({
      ...advertiserFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleActivityChange = (e) => {
    setActivityFormData({
      ...activityFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e) => {
    setAdvertiserFormData({
      ...advertiserFormData,
      logoFile: e.target.files[0],
    });
  };

  const handleAdvertiserSubmit = async (e) => {
    e.preventDefault();
    const { logoFile, ...updatedData } = advertiserFormData;

    const formDataToSend = new FormData();
    if (logoFile) {
      formDataToSend.append("logoFile", logoFile); // Append logo file only if a new one is selected
    }
    Object.keys(updatedData).forEach((key) => {
      formDataToSend.append(key, updatedData[key]);
    });

    try {
      const response = await axios.put(
        `http://localhost:8000/home/adver/updateadver/${adverId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAdvertiser(response.data);

      setIsEditingAdvertiser(false);
      console.log("Advertiser updated:", response.data);
    } catch (error) {
      console.error(
        "Error updating advertiser:",
        error.response ? error.response.data : error.message
      );
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
      const response = await axios.put(
        `http://localhost:8000/activity/update/${activityToEdit._id}`,
        activityFormData
      );
      setActivities(
        activities.map((activity) =>
          activity._id === response.data._id ? response.data : activity
        )
      );
      setIsEditingActivity(false);
      setActivityToEdit(null);
    } catch (error) {
      console.error(
        "Error updating activity:",
        error.response ? error.response.data : error.message
      );
      setError("Error updating activity.");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await axios.delete(
          `http://localhost:8000/activity/delete/${activityId}`
        );
        setActivities(
          activities.filter((activity) => activity._id !== activityId)
        );
        console.log("Activity deleted:", activityId);
      } catch (error) {
        console.error(
          "Error deleting activity:",
          error.response ? error.response.data : error.message
        );
        setError("Error deleting activity.");
      }
    }
  };
  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/home/adver/deletMyAccount/${adverId}`
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

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  if (error) return <div>{error}</div>;
  if (!advertiser) return <div>Loading...</div>;

  // Styles
  return (
    <div className="advertiser-page">
      {/* Navbar */}
      <Navbar className="advertiser-navbar">
        <Container>
          <Navbar.Brand href="#" className="advertiser-navbar-brand">
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
  
      <div className="advertiser-container">
        {/* Left Sidebar */}
        <div className="advertiser-sidebar">
          <h3 className="sidebar-heading">Welcome</h3>
          {advertiser.logo && (
            <img
              src={`data:image/png;base64,${advertiser.logo}`}
              alt="Advertiser Logo"
              className="advertiser-profile-image"
            />
          )}
          <button onClick={() => setShowDetails(!showDetails)} className="sidebar-button">
            {showDetails ? "Hide Details" : "View Details"}
          </button>
          <button onClick={() => setIsEditingAdvertiser(!isEditingAdvertiser)} className="sidebar-button">
            {isEditingAdvertiser ? "Cancel Update Advertiser" : "Update Advertiser"}
          </button>
          <button onClick={() => { fetchAdverActivities(); setShowActivities(!showActivities); }} className="sidebar-button">
            {showActivities ? "Hide Activities" : "View Activities"}
          </button>
          <button className="sidebar-button" onClick={() => navigate("/TouristReport", {
              state: { adverId },
            })
          }>Tourist Report</button>

        
          <button onClick={handleLogout} className="sidebar-button">
            Logout
          </button>
          <button onClick={handleDeleteAccount} className="sidebar-button">
            Delete Account
          </button>
      
          
        {/* Right Sidebar */}

        <div className="advertiser-sidebar-image-container">
          <img src={sidebarImage} alt="Advertiser Sidebar" className="advertiser-sidebar-image" />
        </div>
  </div>

        {/* Main Content */}
        <div className="advertiser-main-content">
  
          {showDetails && (
  <div className="details-card-modern">
    <h3 className="details-heading-modern">Advertiser Details</h3>
    <div className="details-content-modern">
      <div className="details-row-modern">
        <strong>UserName:</strong>
        <span>{advertiser.UserName}</span>
      </div>
      <div className="details-row-modern">
        <strong>Link:</strong>
        <a href={advertiser.Link} target="_blank" rel="noopener noreferrer">
          {advertiser.Link}
        </a>
      </div>
      <div className="details-row-modern">
        <strong>Hotline:</strong>
        <span>{advertiser.Hotline}</span>
      </div>
      <div className="details-row-modern">
        <strong>Email:</strong>
        <a href={`mailto:${advertiser.Email}`}>{advertiser.Email}</a>
      </div>
      <div className="details-row-modern">
        <strong>Profile:</strong>
        <span>{advertiser.Profile}</span>
      </div>
      <div className="details-row-modern">
        <strong>Location:</strong>
        <span>{advertiser.Loc}</span>
      </div>
      <div className="details-row-modern">
        <strong>Company Description:</strong>
        <span>{advertiser.CompanyDes}</span>
      </div>
      <div className="details-row-modern">
        <strong>Services:</strong>
        <span>{advertiser.Services}</span>
      </div>
      <div className="details-row-modern">
        <strong>Notifications:</strong>
        {advertiser.Notifications && advertiser.Notifications.length > 0 ? (
          <ul className="notifications-list-modern">
            {advertiser.Notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        ) : (
          <span>No notifications</span>
        )}
      </div>
    </div>
  </div>
)}


{isEditingAdvertiser && (
  <div className="edit-section-modern">
    <h3 className="section-heading-modern">Update Advertiser</h3>
    <form onSubmit={handleAdvertiserSubmit} className="modern-form">
      <div className="form-row">
        <label>UserName:</label>
        <input
          type="text"
          name="UserName"
          value={advertiserFormData.UserName}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Password:</label>
        <input
          type="password"
          name="Password"
          value={advertiserFormData.Password}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Link:</label>
        <input
          type="url"
          name="Link"
          value={advertiserFormData.Link}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Hotline:</label>
        <input
          type="tel"
          name="Hotline"
          value={advertiserFormData.Hotline}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Email:</label>
        <input
          type="email"
          name="Email"
          value={advertiserFormData.Email}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Profile:</label>
        <input
          type="text"
          name="Profile"
          value={advertiserFormData.Profile}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Location:</label>
        <input
          type="text"
          name="Loc"
          value={advertiserFormData.Loc}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Company Description:</label>
        <textarea
          name="CompanyDes"
          value={advertiserFormData.CompanyDes}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Services:</label>
        <textarea
          name="Services"
          value={advertiserFormData.Services}
          onChange={handleAdvertiserChange}
          required
        />
      </div>
      <div className="form-row">
        <label>Upload New Logo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="reply-button">
          Update
        </button>
        <button
          type="button"
          className="reply-button"
          onClick={() => setIsEditingAdvertiser(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

{showActivities && (
  <div className="activities-section-modern">
    <h3 className="section-heading-modern">Activities</h3>
    {activities.length > 0 ? (
      activities.map((activity) => (
        <div key={activity._id} className="activity-card-modern">
       
          <div className="activity-details">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(activity.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {activity.time}
            </p>
            <p>
              <strong>Location:</strong> {activity.location}
            </p>
            <p>
              <strong>Price:</strong> ${activity.price}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {tags.find((t) => t._id === activity.tags)?.name || "Unknown Tag"}
            </p>
            <p>
              <strong>Special Discount:</strong>{" "}
              {activity.specialDiscount || 0}%
            </p>
            <p>
              <strong>Booking Open:</strong>{" "}
              {activity.isBookingOpen ? "Yes" : "No"}
            </p>
          </div>
          {predefinedLocations.some((loc) => loc.name === activity.location) && (
            <iframe
              title={`Map for ${activity.location}`}
              src={generateMapSrc(
                predefinedLocations.find(
                  (loc) => loc.name === activity.location
                ).coordinates
              )}
              className="activity-map-modern"
            ></iframe>
          )}
        </div>
      ))
    ) : (
      <p className="no-activities-message">No activities found for this advertiser.</p>
    )}
  </div>
)}

        </div>
        <div className="advertiser-right-sidebar">
  <div className="sidebar-buttons">
  <button onClick={() => navigate("/activities")} className="box">
            Create Activities
          </button>
          <button onClick={() => navigate("/transportation")} className="box">
            Create Transportation
          </button>  </div>
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
}  
export default AdvertiserDetails;
