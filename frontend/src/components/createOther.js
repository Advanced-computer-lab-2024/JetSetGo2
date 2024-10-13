import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB file size limit

const OtherSignup = () => {
  const [formData, setFormData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    AccountType: "",
    IDDocument: null,
    Certificates: null,
    TaxationRegistryCard: null,
  });

  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "IDDocument" ||
      name === "Certificates" ||
      name === "TaxationRegistryCard"
    ) {
      const file = e.target.files[0];
      // Validate file size
      if (file && file.size > MAX_FILE_SIZE) {
        alert("File size exceeds 2 MB limit.");
        return;
      }
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Email", formData.Email);
    data.append("UserName", formData.UserName);
    data.append("Password", formData.Password);
    data.append("AccountType", formData.AccountType);
    if (formData.IDDocument) data.append("IDDocument", formData.IDDocument);
    if (formData.Certificates)
      data.append("Certificates", formData.Certificates);
    if (formData.TaxationRegistryCard)
      data.append("TaxationRegistryCard", formData.TaxationRegistryCard);

    try {
      const response = await axios.post(
        "http://localhost:8000/home/other/addOther", // Adjust the endpoint as necessary
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Signup successful:", response.data);
      // After successful signup, navigate based on AccountType
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
      setError("Signup failed. Please try again."); // Set error message
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Sign Up for Other Users</h2>
      {error && <p style={styles.error}>{error}</p>} {/* Show error message */}
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
        <div style={styles.inputGroup}>
          <label style={styles.label}>ID Document:</label>
          <input
            type="file"
            name="IDDocument"
            onChange={handleChange}
            style={styles.input}
            accept=".jpg, .jpeg, .png, .pdf"
            required
          />
        </div>

        {/* Conditional rendering for file uploads */}
        {formData.AccountType === "Advertiser" ||
        formData.AccountType === "Seller" ? (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tax Registry:</label>
            <input
              type="file"
              name="TaxationRegistryCard"
              onChange={handleChange}
              style={styles.input}
              accept=".jpg, .jpeg, .png, .pdf"
              required
            />
          </div>
        ) : null}

        {formData.AccountType === "Tour Guide" ? (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Certificates:</label>
            <input
              type="file"
              name="Certificates"
              onChange={handleChange}
              style={styles.input}
              accept=".jpg, .jpeg, .png, .pdf"
              required
            />
          </div>
        ) : null}

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
  error: {
    color: "red",
    marginBottom: "10px",
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
