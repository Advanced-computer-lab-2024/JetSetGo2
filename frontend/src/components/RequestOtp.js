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
    <div>
      <h2>Forgot Password? Request OTP</h2>
      <form onSubmit={handleSubmit}>
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
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RequestOtp;
