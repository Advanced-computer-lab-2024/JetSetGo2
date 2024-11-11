import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f7f8fa",
    padding: "20px",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#2d3e50",
    padding: "20px",
    borderRadius: "10px",
    color: "#fff",
  },
  profileContainer: {
    textAlign: "center",
  },
  profileImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "15px",
    border: "3px solid #fff",
    objectFit: "cover",
  },
  profileName: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#ff6348",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, transform 0.3s",
    width: "180px",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    marginLeft: "30px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#2d3e50",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
  },
};

const TourGuidePage = () => {
  const navigate = useNavigate();
  const [tourGuide, setTourGuide] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
          setError("No Tour Guide ID found in local storage.");
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
      setNotification("Tour guide details updated successfully!");
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


  // Function to handle account deletion
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
        // Handle errors, such as when there are upcoming booked itineraries
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

  const handleCancel = () => {
    setIsEditing(false); // Exit edit mode without saving changes
  };

  if (error) return <div style={styles.error}>{error}</div>;
  if (!tourGuide) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.profileContainer}>
        <img 
                          src={`data:image/png;base64,${tourGuide.Photo}`} 
                          alt="Product" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                        />
          <p style={styles.profileName}>{tourGuide.UserName}</p>
          <button onClick={() => setIsEditing(true)} style={styles.button}>
            Edit
          </button>
          <button onClick={handleSchemaTourFrontPage} style={styles.button}>
            Create/View Itinerary
          </button>
          <button style={styles.button} onClick={handleLogout}>
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
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.header}>Tour Guide Details</h1>

        {notification && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              borderRadius: "5px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {notification}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label>UserName:</label>
              <input
                name="UserName"
                value={formData.UserName}
                onChange={handleChange}
                style={styles.inputStyle}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Password:</label>
              <input
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                style={styles.inputStyle}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Email:</label>
              <input
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                style={styles.inputStyle}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Age:</label>
              <input
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                style={styles.inputStyle}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Languages Spoken:</label>
              <input
                name="LanguagesSpoken"
                value={formData.LanguagesSpoken}
                onChange={handleChange}
                style={styles.inputStyle}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Mobile Number:</label>
              <input
                name="MobileNumber"
                value={formData.MobileNumber}
                onChange={handleChange}
                style={styles.inputStyle}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Years of Experience:</label>
              <input
                name="YearsOfExperience"
                value={formData.YearsOfExperience}
                onChange={handleChange}
                style={styles.inputStyle}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Previous Work:</label>
              <input
                name="PreviousWork"
                value={formData.PreviousWork}
                onChange={handleChange}
                style={styles.inputStyle}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Upload Photo:</label>
              <input
  type="file"
  accept="image/*"
  onChange={(e) => handleImageUpload(e, setFormData)}
  required
/>
            </div>

            <button type="submit" style={styles.button}>
              Update
            </button>
            <button type="button" onClick={handleCancel} style={styles.button}>
              Cancel
            </button>
          </form>
        ) : (
          <ul>
            <li>
              <strong>UserName:</strong> {tourGuide.UserName}
            </li>

            <li>
              <strong>Email:</strong> {tourGuide.Email}
            </li>
            <li>
              <strong>Age:</strong> {tourGuide.Age}
            </li>
            <li>
              <strong>Languages Spoken:</strong> {tourGuide.LanguagesSpoken}
            </li>
            <li>
              <strong>Mobile Number:</strong> {tourGuide.MobileNumber}
            </li>
            <li>
              <strong>Years of Experience:</strong>{" "}
              {tourGuide.YearsOfExperience}
            </li>
            <li>
              <strong>Previous Work:</strong> {tourGuide.PreviousWork}
            </li>
          </ul>
        )}

        {/* Navigation Links */}
        <nav style={styles.navbar}>
          <Link to="/Upcoming-activities" style={styles.navLink}>
            Activities
          </Link>
          <Link to="/Upcoming-itinerariestg" style={styles.navLink}>
            Itineraries
          </Link>
          <Link to="/all-historicalplaces" style={styles.navLink}>
            Historical Places
          </Link>
          <Link to="/all-museums" style={styles.navLink}>
            Museums
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default TourGuidePage;
