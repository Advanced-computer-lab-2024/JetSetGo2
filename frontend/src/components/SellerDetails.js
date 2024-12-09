import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SellerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const [Seller, setSeller] = useState(null);
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

  const cancelButtonStyle = {
    ...buttonStyle,
   // backgroundColor: "#2d3e50",
    color: "#fff",
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
        <strong>UserName:</strong> {Seller.UserName}
      </li>
      <li style={listItemStyle}>
        <strong>Email:</strong> {Seller.Email}
      </li>
      <li style={listItemStyle}>
        <strong>Name:</strong> {Seller.Name}
      </li>
      <li style={listItemStyle}>
        <strong>Pick Up Location:</strong> {Seller.PickUp_Location}
      </li>
      <li style={listItemStyle}>
        <strong>Type of Products:</strong> {Seller.Type_Of_Products}
      </li>
      <li style={listItemStyle}>
        <strong>Previous Work:</strong> {Seller.Previous_Work}
      </li>
      <li style={listItemStyle}>
        <strong>Age:</strong> {Seller.Age}
      </li>
      {Seller.logo && (
        <li style={listItemStyle}>
          <strong>Logo:</strong>{" "}
          <img
            src={`data:image/png;base64,${Seller.logo}`}
            alt="Product"
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
          value={formData.UserName}
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
          value={formData.Email}
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
          value={formData.Name}
          onChange={handleChange}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Password:</label>
        <input
          style={inputStyle}
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Pick Up Location:</label>
        <input
          style={inputStyle}
          name="PickUp_Location"
          value={formData.PickUp_Location}
          onChange={handleChange}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Type of Products:</label>
        <input
          style={inputStyle}
          name="Type_Of_Products"
          value={formData.Type_Of_Products}
          onChange={handleChange}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Previous Work:</label>
        <input
          style={inputStyle}
          name="Previous_Work"
          value={formData.Previous_Work}
          onChange={handleChange}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Age:</label>
        <input
          style={inputStyle}
          name="Age"
          value={formData.Age}
          onChange={handleChange}
          type="number"
          required
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Logo:</label>
        <input
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
        style={cancelButtonStyle}
        type="button"
        onClick={() => setIsEditing(false)} // Cancel button logic
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
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <img
          src={`data:image/png;base64,${Seller.logo}`}
          alt="Product"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        <h2>{Seller.UserName}</h2>
        <button
          style={buttonStyle}
          onClick={() => handleSidebarClick("details")}
        >
          View Details
        </button>
        <button style={buttonStyle} onClick={() => handleSidebarClick("edit")}>
          Edit Details
        </button>
        <h3 style={{ color: "#ff6348" }}>Explore</h3>
        <button style={buttonStyle} onClick={() => navigate("/productList")}>
          View Products
        </button>
        <button style={buttonStyle} onClick={() => navigate("/product")}>
          Add/Edit Product
        </button>

        <button
          style={buttonStyle}
          onClick={() => navigate("/Upcoming-activities")}
        >
          View Activities
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
        <button onClick={() => navigate("/SellerRevenue")} style={buttonStyle}>
  View Revenue
</button>
        <button onClick={handleLogout}>
            Logout
          </button> {/* Logout Button */}
        <button onClick={handleDeleteAccount} style={{ color: "red", background: "lightgrey", padding: "10px", marginTop: "20px" }}>
        Delete Account
      </button>
      </div>
      <div style={mainContentStyle}>
        <h1 style={headerStyle}>
          {isEditing ? "Edit Seller" : "Seller Details"}
        </h1>
        {notification && <div style={notificationStyle}>{notification}</div>}
        {isEditing ? renderEditForm() : renderDetails()}
      </div>
    </div>
  );
};

export default SellerDetails;
