// HomePage.js
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
        <button style={styles.button} onClick={() => navigate("/adminCapabilities")}>
          Admin
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
    backgroundImage: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    color: "#fff",
    fontSize: "36px",
    marginBottom: "40px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    width: "50%",
  },
  button: {
    backgroundColor: "#fff",
    color: "#2575fc",
    border: "none",
    padding: "15px 30px",
    borderRadius: "30px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    outline: "none",
  },
  buttonHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.3)",
  },
};

// Apply hover effect using plain JS
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      button.style.transform = styles.buttonHover.transform;
      button.style.boxShadow = styles.buttonHover.boxShadow;
    });
    button.addEventListener("mouseout", () => {
      button.style.transform = "";
      button.style.boxShadow = styles.button.boxShadow;
    });
  });
});

export default HomePage;
