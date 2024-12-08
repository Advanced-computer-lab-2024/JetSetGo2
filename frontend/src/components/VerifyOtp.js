import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const storedOtp = localStorage.getItem("otp");
    if (otp === storedOtp) {
      setMessage("OTP verified successfully!");
      setTimeout(() => navigate("/change-password"), 2000);
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter OTP:</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VerifyOtp;
