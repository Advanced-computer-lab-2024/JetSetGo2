import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TouristSignup = () => {
  const [formData, setFormData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    MobileNumber: "",
    Nationality: "",
    DateOfBirth: "",
    Job: "",
  });

  const [error, setError] = useState(""); // State to hold error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/home/tourist/addTourist",
        formData
      );
      console.log("Signup successful:", response.data);

      // Redirect to the update page without the ID in the URL
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occurred while signing up. Please try again."); // Setting error message
    }
  };

  return (
    <div style={styles.container}>
      
      <h2 style={styles.header}>Tourist Signup</h2>
      
      {error && <p style={styles.error}>{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {Object.entries(formData).map(([key, value]) => (
          <div style={styles.inputGroup} key={key}>
            <label style={styles.label}>
              {key.replace(/([A-Z])/g, " $1").trim()}:
            </label>
            <input
              type={
                key === "Password"
                  ? "password"
                  : key === "DateOfBirth"
                  ? "date"
                  : "text"
              }
              name={key}
              value={value}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        ))}
        <button type="submit" style={styles.button}>
          Sign Up
        </button>
        <button className="back-button" onClick={() => navigate('/')}>
          Home
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#2d3e50", // Dark background color
    fontFamily: "'Poppins', sans-serif",
    margin: 0, // Remove any margin
    padding: 0, // Remove any padding
  },
  header: {
    color: "#ffffff", // Change header color to white for better visibility
    fontSize: "36px",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  inputGroup: {
    width: "100%",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: {
    backgroundColor: "#ff6348", // Match with tourist home page button color
    color: "#fff",
    padding: "12px 25px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
    width: "100%", // Ensure button takes full width
  },
  error: {
    color: "red",
    marginBottom: "15px",
    textAlign: "center",
  },
};

// Set global styles in the body
document.body.style.margin = "0"; // Remove any margin from body
document.body.style.backgroundColor = "#2d3e50"; // Set dark background color for the entire page

export default TouristSignup;
