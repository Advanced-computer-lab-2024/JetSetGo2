import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const OtherSignup = () => {
  const [formData, setFormData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    AccountType: "", // Added this field to match the enum
  });

  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/home/other/addOther", // Adjust the endpoint as necessary
        formData
      );
      console.log("Signup successful:", response.data);

      // After successful signup, navigate to the appropriate page based on AccountType
      if (formData.AccountType === "Advertiser") {
        navigate("/AdvirtiserMain");
      } else if (formData.AccountType === "Tour Guide") {
        navigate("/CreateTourGuide");
      } else if (formData.AccountType === "Seller") {
        navigate("/CreateSeller");
      } else {
        console.error("Unknown account type");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Sign Up for Other Users</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>UserName:</label>
          <input
            type="text"
            name="UserName"
            value={formData.UserName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Account Type:</label>
          <select
            name="AccountType"
            value={formData.AccountType}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Account Type</option>
            <option value="Advertiser">Advertiser</option>
            <option value="Tour Guide">Tour Guide</option>
            <option value="Seller">Seller</option>
          </select>
        </div>
        <button type="submit" style={styles.button}>
          Sign Up
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    color: "#fff",
    fontSize: "30px",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  },
  form: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  button: {
    backgroundColor: "#764ba2",
    color: "#fff",
    padding: "12px 25px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px",
    transition: "background-color 0.3s ease",
  },
};

export default OtherSignup;
