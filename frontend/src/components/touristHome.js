import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TouristHome = ({ selectedTouristId }) => {
  const [touristData, setTouristData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    MobileNumber: "",
    Nationality: "",
    DateOfBirth: "",
    Job: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Tourist ID:", selectedTouristId); // Log touristId to verify if it's passed

    const fetchTouristData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/home/tourist/getTourist/${selectedTouristId}`
        );
        console.log("Tourist Data:", response.data); // Log the data fetched
        setTouristData(response.data);
      } catch (error) {
        console.error("Error fetching tourist data:", error);
      }
    };

    if (selectedTouristId) {
      fetchTouristData();
    } else {
      console.log("No touristId provided");
    }
  }, [selectedTouristId]);

  const handleUpdateClick = () => {
    navigate("/tourist-update");
  };

  if (!touristData) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Loading tourist data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileContainer}>
        <div style={styles.profileHeader}>
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            style={styles.profileImage}
          />
          <h1 style={styles.profileName}>{touristData.UserName}</h1>
          <p style={styles.profileDetails}>{touristData.Email}</p>
        </div>
        <div style={styles.bio}>
          <h2 style={styles.bioTitle}>About Me</h2>
          <p style={styles.bioText}>
            Nationality: {touristData.Nationality}
            <br />
            Job: {touristData.Job}
            <br />
            Date of Birth:{" "}
            {new Date(touristData.DateOfBirth).toLocaleDateString()}
          </p>
        </div>
        <button onClick={handleUpdateClick} style={styles.button}>
          Update Your Profile
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #c9ffbf 0%, #ffafbd 100%)",
    fontFamily: "'Poppins', sans-serif",
  },
  profileContainer: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    width: "500px",
    textAlign: "center",
  },
  profileHeader: {
    marginBottom: "20px",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
  },
  profileName: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
  },
  profileDetails: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "20px",
  },
  bio: {
    textAlign: "left",
    marginBottom: "30px",
  },
  bioTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  bioText: {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#555",
  },
  button: {
    backgroundColor: "#ff758c",
    color: "#fff",
    padding: "12px 30px",
    borderRadius: "30px",
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease",
  },
  errorText: {
    color: "#ff0000",
    fontSize: "20px",
  },
};

export default TouristHome;
