// RequestOtp.js
import React, { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./request-otp.css"; // Import the new CSS file

const RequestOtp = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to navigate between routes
  useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/otp/send-otp", {
        email,
      });

      const { otp, message } = response.data;

      // Save email and OTP to local storage
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("otp", response.data.otp);

      setMessage(message);

      // Navigate to the Verify OTP page
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="request-otp-body">
      <div className="request-otp-container">
        {/* Left Section */}
        <div className="request-otp-left">
          <button className="reply-button" onClick={() => navigate("/")}>
            Back
          </button>
        </div>
        
        {/* Right Section */}
        <div className="request-otp-right">
          <h2>Forgot Password? Request OTP</h2>
          <form className="request-otp-form" onSubmit={handleSubmit}>
            <div className="request-otp-form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit">Send OTP</button>
          </form>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RequestOtp;