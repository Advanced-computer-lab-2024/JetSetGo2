import React, { useState,useEffect } from "react";
import axios from "axios";
import './ChangePassword.css';

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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

    const email = localStorage.getItem("email");

    try {
      const response = await axios.post(
        "http://localhost:8000/otp/change-password",
        {
          email,
          newPassword: password,
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="change-password-container">
    <h2 className="change-password-title">Change Password</h2>
    <form className="change-password-form" onSubmit={handleSubmit}>
      <input
        type="password"
        className="change-password-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <button className="reply-button" type="submit">
        Change Password
      </button>
    </form>
    {message && <p className="success-message">{message}</p>}
    {error && <p className="error-message">{error}</p>}
  </div>
  
  );
};

export default ChangePassword;