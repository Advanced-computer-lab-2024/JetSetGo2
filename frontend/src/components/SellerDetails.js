import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SellerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const [Seller, setSeller] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    PickUp_Location: "",
    Type_Of_Products: "",
    Previous_Work: "",
    Age: "",
    Email: "",
    logoFile: null, // State to hold the logo file
  });
  const [selectedSection, setSelectedSection] = useState(""); // Track selected section
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
    backgroundColor: "#2d3e50",
    borderRadius: "10px",
    color: "#fff",
    position: "relative",
  };

  const avatarStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "2px solid #fff",
    position: "absolute",
    top: "20px",
    left: "20px",
    objectFit: "cover",
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
    backgroundColor: "#2d3e50",
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
        if (id) {
          const response = await axios.get(
            `http://localhost:8000/Seller/readSeller/${id}`
          );
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    setFormData({ ...formData, logoFile: e.target.files[0] });
  };

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
      const response = await axios.put(
        `http://localhost:8000/Seller/updateSeller/${id}`,
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
  };

  const renderDetails = () => (
    <ul style={listStyle}>
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
      <li style={listItemStyle}>
        <strong>Email:</strong> {Seller.Email}
      </li>
      {Seller.logo && (
        <li style={listItemStyle}>
          <strong>Logo:</strong>{" "}
          <img
            src={`http://localhost:8000/uploads/sellerLogo/${Seller.logo}`} // Use the actual logo field from the seller object
            alt="Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </li>
      )}
    </ul>
  );

  const renderEditForm = () => (
    <form onSubmit={handleSubmit}>
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
          type="number"
          value={formData.Age}
          onChange={handleChange}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Email:</label>
        <input
          style={inputStyle}
          name="Email"
          type="email"
          value={formData.Email}
          onChange={handleChange}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Upload New Logo:</label>
        <input
          type="file"
          accept="image/*"
          name="logoFile"
          onChange={handleLogoChange}
        />
      </div>
      <button style={buttonStyle} type="submit">
        Save Changes
      </button>
      <button
        style={cancelButtonStyle}
        type="button"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </form>
  );

  if (error) {
    return <div style={errorStyle}>{error}</div>;
  }

  if (!Seller) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <img
          src={
            Seller?.logo
              ? `http://localhost:8000/uploads/sellerLogo/${Seller.logo}`
              : "path/to/default/avatar.jpg"
          } // Default avatar path
          alt="Avatar"
          style={avatarStyle}
        />
        <button
          style={buttonStyle}
          onClick={() => handleSidebarClick("details")}
        >
          Seller Details
        </button>
        <button style={buttonStyle} onClick={() => handleSidebarClick("edit")}>
          Edit Seller
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
      </div>
      <div style={mainContentStyle}>
        <h2 style={headerStyle}>
          {selectedSection === "details" ? "Seller Details" : "Edit Seller"}
        </h2>
        {notification && <div style={notificationStyle}>{notification}</div>}
        {selectedSection === "details" && renderDetails()}
        {selectedSection === "edit" && renderEditForm()}
      </div>
    </div>
  );
};

export default SellerDetails;
