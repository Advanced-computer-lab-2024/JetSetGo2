import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateTouristPage = ({ selectedTouristId }) => {
  const [touristData, setTouristData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    MobileNumber: "",
    Nationality: "",
    DateOfBirth: "",
    Job: "",
  });
  const [formData, setFormData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    MobileNumber: "",
    Nationality: "",
    DateOfBirth: "",
    Job: "",
  });
  const [error, setError] = useState("");

  // Fetch tourist details on component mount
  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/home/tourist/getTourist/${selectedTouristId}`
        );
        setTouristData(response.data);
        setFormData(response.data); // Pre-fill form with the current tourist data
      } catch (error) {
        console.error("Error fetching tourist data:", error);
        setError(
          "An error occurred while fetching tourist data. Please try again."
        );
      }
    };

    if (selectedTouristId) {
      fetchTouristData();
    }
  }, [selectedTouristId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form input values only
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/home/tourist/updateTourist/${selectedTouristId}`,
        formData
      );
      console.log("Update successful:", response.data);
      setTouristData(response.data); // Update the displayed tourist details after successful form submission
    } catch (error) {
      console.error("Error updating tourist details:", error);
      setError(
        "An error occurred while updating tourist details. Please try again."
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Edit Tourist</h2>
      <div style={styles.contentWrapper}>
        {/* Display Tourist Details */}
        <div style={styles.touristDetails}>
          <h3>Tourist Information</h3>
          <p>
            <strong>Email:</strong> {touristData.Email}
          </p>
          <p>
            <strong>UserName:</strong> {touristData.UserName}
          </p>
          <p>
            <strong>Mobile Number:</strong> {touristData.MobileNumber}
          </p>
          <p>
            <strong>Nationality:</strong> {touristData.Nationality}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(touristData.DateOfBirth).toLocaleDateString()}
          </p>
          <p>
            <strong>Job:</strong> {touristData.Job}
          </p>
        </div>

        {/* Update Form */}
        <div style={styles.formContainer}>
          <form onSubmit={handleUpdate} style={styles.form}>
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
              <label style={styles.label}>Mobile Number:</label>
              <input
                type="text"
                name="MobileNumber"
                value={formData.MobileNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nationality:</label>
              <input
                type="text"
                name="Nationality"
                value={formData.Nationality}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Birth:</label>
              <input
                type="date"
                name="DateOfBirth"
                value={formData.DateOfBirth}
                style={styles.input}
                readOnly // This makes the Date of Birth field uneditable
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Job:</label>
              <input
                type="text"
                name="Job"
                value={formData.Job}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>
              Update Tourist
            </button>
          </form>
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
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
    background: "linear-gradient(135deg, #74ebd5 0%, #9face6 100%)",
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
  },
  header: {
    color: "#fff",
    fontSize: "36px",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: "1200px",
    padding: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    backgroundColor: "#fff",
  },
  touristDetails: {
    flex: 1,
    padding: "20px",
    borderRight: "1px solid #ddd",
  },
  formContainer: {
    flex: 1,
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  button: {
    backgroundColor: "#9face6",
    color: "#fff",
    padding: "12px 25px",
    borderRadius: "5px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  buttonHover: {
    backgroundColor: "#79c1e0",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },
};

export default UpdateTouristPage;
