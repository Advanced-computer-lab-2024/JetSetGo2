import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

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

  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
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

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occurred while signing up. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="signup-left">
        <h1>Back to website →</h1>
        <div className="caption">
          <p>Capturing Moments, Creating Memories</p>
          <div className="pagination-dots">
            <span></span>
            <span></span>
            <span className="active"></span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="signup-right">
        <h2>Create an account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Username and DOB Fields */}
          <div className="form-row">
            <input
              type="text"
              name="UserName"
              value={formData.UserName}
              onChange={handleChange}
              className="form-control"
              placeholder="Username"
              required
            />
            <input
              type="date"
              name="DateOfBirth"
              value={formData.DateOfBirth}
              onChange={handleChange}
              className="form-control"
              placeholder="DOB"
              required
            />
          </div>

          {/* Email Field */}
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className="form-control"
            placeholder="Email"
            required
          />

          {/* Password Field */}
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Mobile Number Field */}
          <input
            type="text"
            name="MobileNumber"
            value={formData.MobileNumber}
            onChange={handleChange}
            className="form-control"
            placeholder="Mobile Number"
            required
          />

          {/* Nationality Field */}
          <input
            type="text"
            name="Nationality"
            value={formData.Nationality}
            onChange={handleChange}
            className="form-control"
            placeholder="Nationality"
            required
          />

          {/* Job Field */}
          <input
            type="text"
            name="Job"
            value={formData.Job}
            onChange={handleChange}
            className="form-control"
            placeholder="Job"
            required
          />

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Create account
          </button>

          {/* Login Redirect */}
          <div className="login-redirect">
            <p>
              Already have an account?{" "}
              <a href="/login" className="login-link">
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
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
    //backgroundColor: "#2d3e50", // Dark background color
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
document.body.style.backgroundColor = "#ffffff"; // Set dark background color for the entire page

export default TouristSignup;
