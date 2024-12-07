import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import "../css/signup.css"; // Assuming the CSS file you provided is named signup.css

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

export default TouristSignup;
