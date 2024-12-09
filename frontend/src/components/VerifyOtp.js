import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/VerifyOtp.css';

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

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
    <div className="verify-otp-body">
      <div className="verify-otp-container">
      <div className="verify-otp-left">
  <button onClick={() => navigate("/request-otp")} className="back-button">BACK</button>
  <div className="verify-otp-caption"></div>




          <div className="verify-otp-caption"></div>
        </div>
        <div className="verify-otp-right">
          <h2>Enter the OTP</h2>
          <form className="verify-otp-form" onSubmit={handleSubmit}>
            <div className="verify-otp-form-group">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
            <button type="submit">Verify OTP</button>
          </form>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;