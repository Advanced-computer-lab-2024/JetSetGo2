import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateTouristPage = () => {
  const { id } = useParams();
  const [tourist, setTourist] = useState(null); // Holds tourist data for display
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    MobileNumber: "",
    Nationality: "",
    DateOfBirth: "",
    Job: "",
  });
  const [dateLocked, setDateLocked] = useState(false); // State to control whether date field is editable
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTourist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/home/tourist/getTourist/${id}`
        );
        setTourist(response.data); // Set tourist data for display
        setFormData(response.data); // Pre-fill the form with tourist data

        if (response.data.DateOfBirth) {
          setDateLocked(true); // Lock the date field if it's already set
        }
      } catch (err) {
        console.error("Failed to fetch tourist details:", err);
        setError("Failed to load tourist details");
      }
    };

    if (id) {
      fetchTourist();
    } else {
      setError("Tourist ID is not provided");
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/home/tourist/updateTourist`,
        {
          id: id, // Include the ID in the request
          ...formData,
        }
      );
      console.log("Update successful:", response.data);
      setTourist(response.data); // Update the displayed tourist data after successful submission
    } catch (error) {
      console.error("Error updating tourist:", error);
      setError(
        "An error occurred while updating tourist details. Please try again."
      );
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!tourist) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Edit Tourist</h2>
      <div style={styles.contentWrapper}>
        {/* Display Tourist Details */}
        <div style={styles.touristDetails}>
          <h3>Tourist Information</h3>
          <p>
            <strong>Email:</strong> {tourist.Email}
          </p>
          <p>
            <strong>UserName:</strong> {tourist.UserName}
          </p>
          <p>
            <strong>Mobile Number:</strong> {tourist.MobileNumber}
          </p>
          <p>
            <strong>Nationality:</strong> {tourist.Nationality}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(tourist.DateOfBirth).toLocaleDateString()}
          </p>
          <p>
            <strong>Job:</strong> {tourist.Job}
          </p>
        </div>

        {/* Update Form */}
        <div style={styles.formContainer}>
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
                onChange={handleChange}
                style={styles.input}
                required
                disabled={dateLocked} // Disable the input if the date is already set
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
    minHeight: "100vh",
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "80%",
  },
  touristDetails: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    width: "45%",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    width: "45%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: "20px",
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
  },
};

export default UpdateTouristPage;
