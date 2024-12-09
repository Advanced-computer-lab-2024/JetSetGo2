import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  };

  const mainContentStyle = {
    flex: 1,
    marginLeft: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#ff6348",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "10px",
    width: "100%",
    fontSize: "16px",
  };
  const profileImage = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "15px",
    border: "3px solid #fff",
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3>Welcome</h3>
        <img
          src={`data:image/png;base64,${advertiser.logo}`}
          alt="Product"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={buttonStyle}
        >
          {showDetails ? "Hide Details" : "View Details"}
        </button>
        <button
          onClick={() => setIsEditingAdvertiser(!isEditingAdvertiser)}
          style={buttonStyle}
        >
          {isEditingAdvertiser
            ? "Cancel Update Advertiser"
            : "Update Advertiser"}
        </button>
        <button
          onClick={() =>
            fetchAdverActivities() && setShowActivities(!showActivities)
          }
          style={buttonStyle}
        >
          {showActivities ? "Hide Activities" : "View Activities"}
        </button>
        <button onClick={() => navigate("/activities")} style={buttonStyle}>
          Create Activities
        </button>
        <button onClick={() => navigate("/transportation")} style={buttonStyle}>
          Create Transportation
        </button>
        <button onClick={() => navigate("/AdvertiserSales")} style={buttonStyle}>
          Revenue Reporte
        </button>

        <button
          onClick={() =>
            navigate("/TouristReport", {
              state: { adverId },
            })
          }
        >
          View Tourist Report
        </button>


        <h3 style={{ color: "#ff6348" }}>Explore</h3>

        <button
          style={buttonStyle}
          onClick={() => navigate("/Upcoming-activities")}
        >
          View Upcoming Activities
        </button>
        <button
          style={buttonStyle}
          onClick={() => navigate("/Upcoming-itineraries")}
        >
          View Itineraries
        </button>
        <button
          style={buttonStyle}
          onClick={() => navigate("/all-historicalplaces")}
        >
          Historical Places
        </button>
        <button style={buttonStyle} onClick={() => navigate("/all-museums")}>
          Museums
        </button>
        <button onClick={handleLogout}>
          Logout
        </button> {/* Logout Button */}
        <button
          onClick={handleDeleteAccount}
          style={{
            color: "red",
            background: "lightgrey",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          Delete Account
        </button>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {showDetails && (
          <div>
            <h3>Advertiser Details</h3>
            <p>
              <strong>UserName:</strong> {advertiser.UserName}
            </p>

            <p>
              <strong>Link:</strong> {advertiser.Link}
            </p>
            <p>
              <strong>Hotline:</strong> {advertiser.Hotline}
            </p>
            <p>
              <strong>Email:</strong> {advertiser.Email}
            </p>
            <p>
              <strong>Profile:</strong> {advertiser.Profile}
            </p>
            <p>
              <strong>Location:</strong> {advertiser.Loc}
            </p>
            <p>
              <strong>Company Description:</strong> {advertiser.CompanyDes}
            </p>
            <p>
              <strong>Services:</strong> {advertiser.Services}
            </p>
            <p>
              <strong>Notifications:</strong>
              {advertiser.Notifications && advertiser.Notifications.length > 0 ? (
                <ul>
                  {advertiser.Notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </p>
          </div>
        )}

        {isEditingAdvertiser && (
          <div>
            <h3>Update Advertiser</h3>
            <form onSubmit={handleAdvertiserSubmit}>
              <div>
                <label>UserName:</label>
                <input
                  name="UserName"
                  value={advertiserFormData.UserName}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  name="Password"
                  value={advertiserFormData.Password}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>

              <div>
                <label>Link:</label>
                <input
                  name="Link"
                  value={advertiserFormData.Link}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>
              <div>
                <label>Hotline:</label>
                <input
                  name="Hotline"
                  value={advertiserFormData.Hotline}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  name="Eail"
                  value={advertiserFormData.Email}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>
              <div>
                <label>Profile:</label>
                <input
                  name="Profile"
                  value={advertiserFormData.Profile}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>
              <div>
                <label>Location:</label>
                <input
                  name="Loc"
                  value={advertiserFormData.Loc}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>
              <div>
                <label>Company Description:</label>
                <textarea
                  name="CompanyDes"
                  value={advertiserFormData.CompanyDes}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>
              <div>
                <label>Services:</label>
                <textarea
                  name="Services"
                  value={advertiserFormData.Services}
                  onChange={handleAdvertiserChange}
                  required
                />
              </div>
              <div>
                <label>Upload New Logo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setAdvertiserFormData)}
                  required
                />
              </div>
              <button type="submit">Update</button>
              <button
                type="button"
                onClick={() => setIsEditingAdvertiser(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Display Activities Section */}
        {showActivities && (
          <div>
            <h3>Activities</h3>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity._id}>
                  <h4>
                    {categories.find((cat) => cat._id === activity.category)
                      ?.name || "Unknown Category"}
                  </h4>
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
                    {tags.find((t) => t._id === activity.tags)?.name ||
                      "Unknown Tag"}
                  </p>
                  <p>
                    <strong>Special Discount:</strong>{" "}
                    {activity.specialDiscount}%
                  </p>
                  <p>
                    <strong>Booking Open:</strong>{" "}
                    {activity.isBookingOpen ? "Yes" : "No"}
                  </p>
                  {predefinedLocations.find(
                    (loc) => loc.name === activity.location
                  ) && (
                      <iframe
                        title={`Map for ${activity.location}`}
                        src={generateMapSrc(
                          predefinedLocations.find(
                            (loc) => loc.name === activity.location
                          ).coordinates
                        )}
                        width="300"
                        height="200"
                        style={{ border: "none" }}
                      ></iframe>
                    )}
                </div>
              ))
            ) : (
              <p>No activities found for this advertiser.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertiserDetails;
