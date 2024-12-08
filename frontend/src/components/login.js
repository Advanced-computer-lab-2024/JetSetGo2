import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import '../css/login.css';


const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();
  


  const handleLogin = async (e) => {
    e.preventDefault();

    const tourismGovernorEmail = "tourism@gmail.com";
    const tourismGovernorPassword = localStorage.getItem("tourismGovernorPassword") || "tourism123";
    //const tourismGovernorPassword = "tourism123";

    if (
      Email === tourismGovernorEmail &&
      Password === tourismGovernorPassword
    ) {
      // Navigate directly without checking backend
      navigate("/tourismGovernorPage");
      return;
    }

    // Continue with the backend check if the email/password doesn't match
    try {
      const response = await axios.post("http://localhost:8000/login/login", {
        Email,
        Password,
      });

      // Check for successful login response
      if (response.status === 200) {
        const { token, userId, AccountType, profileCompleted, adminAccept } =
          response.data;

        // Store the token and user ID in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        setSuccessMessage("Login successful!");
        setErrorMessage("");

        if (AccountType === "Admin") {
          navigate("/adminCapabilities");
        }

        if (AccountType === "Tourist") {
          navigate("/tourist-home");
        }

        if (!adminAccept) {
          navigate("/AdminAcceptance");
        } else if (!profileCompleted) {
          // Navigate based on profile completion and AccountType
          if (AccountType === "TourGuide") {
            navigate("/CreateTourGuide"); // Redirect to profile completion page
          } else if (AccountType === "Advertiser") {
            navigate("/AdvirtiserMain"); // Redirect to profile completion page
          } else if (AccountType === "Seller") {
            navigate("/CreateSeller"); // Redirect to profile completion page
          }
        } else {
          if (AccountType === "TourGuide") {
            navigate("/tour-guide");
          } else if (AccountType === "Advertiser") {
            navigate("/list");
          } else if (AccountType === "Seller") {
            navigate("/seller-details");
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data.message || "Login failed. Please try again."
      );
      setSuccessMessage("");
    }
  };
  
  

return (
  <>
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    rel="stylesheet"
  />
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
 <div className="Background">
  <div className="LoginContainer">
    <h2 className="LoginTitle">Login </h2>
    <p className="LoginSubtitle">Welcome back! Please login to continue.</p>
    <form className="LoginForm" onSubmit={handleLogin}>
      {/* Email Input */}
      <div className="mb-3">
        <div className="input-icon-container">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            className="LoginInput"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="mb-3">
        <div className="input-icon-container">
          <i className="fas fa-lock"></i>
          <input
          type={showPassword ? "text" : "password"} // Toggle between text and password
            className="LoginInput"
            placeholder="Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
           <i
      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
      onClick={() => setShowPassword(!showPassword)} // Toggle state
    ></i>
        </div>
        
      </div>

      {/* Submit Button */}
      <button type="submit" className="LoginButton">
        Login
      </button>
      <a href="/request-otp" className="ForgotPassword">
          Forgot password?
        </a>
    </form>

    {/* Error & Success Messages */}
    {errorMessage && <div className="ErrorMessage">{errorMessage}</div>}
    {successMessage && <div className="SuccessMessage">{successMessage}</div>}
  </div>
</div>

  </>
);
}

export default Login;