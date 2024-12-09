import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RequestOtp = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to navigate between routes

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
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <div className="container">
        <h2>
          Forgot Password?
          <br />
          Request OTP
        </h2>
        <form onSubmit={handleSubmit} className="form-container">
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Send OTP</button>
        </form>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default RequestOtp;
