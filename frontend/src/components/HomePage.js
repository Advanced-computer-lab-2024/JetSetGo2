import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome to the Signup Page</h1>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => navigate("/tourist-signup")}
        >
          Tourist Signup
        </button>
        <button style={styles.button} onClick={() => navigate("/other-signup")}>
          Other Signup
        </button>
        <button
          style={styles.button}
          onClick={() => navigate("/adminCapabilities")}
        >
          Admin
        </button>
        <button style={styles.button} onClick={() => navigate("/tourismGovernorPage")}>
          Tourism Governor
        </button>
        <button style={styles.button} onClick={() => navigate("/login")}>
          Login
        </button>
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
    backgroundColor: "#2d3e50", // Dark background color to match the signup page
    fontFamily: "'Poppins', sans-serif",
    color: "#fff", // White text for contrast
    margin: 0, // Remove white border
    padding: 0, // Remove white border
  },
  header: {
    fontSize: "36px",
    marginBottom: "40px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column", // Stack buttons vertically
    alignItems: "center", // Center align buttons
    width: "100%", // Full width for responsiveness
  },
  button: {
    backgroundColor: "#ff6348", // Adjusted button color to match signup page
    color: "#fff", // White text for buttons
    border: "none",
    padding: "15px 30px",
    borderRadius: "30px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    outline: "none",
    marginBottom: "15px", // Spacing between buttons
    width: "80%", // Make buttons responsive
  },
};

// Removed hover effect using plain JS to streamline the component
export default HomePage;
