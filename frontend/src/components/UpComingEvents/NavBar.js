// src/components/Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <a href="#activities" style={styles.link}>
        Activities
      </a>
      <a href="#itineraries" style={styles.link}>
        Itineraries
      </a>
      <a href="#places" style={styles.link}>
        Historical Places
      </a>
      <a href="#museums" style={styles.link}>
        Museums
      </a>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#333",
    padding: "1rem 2rem", // Adjust padding for a larger area
    borderRadius: "10px", // Add border radius for rounded corners
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)", // Optional: Add a shadow for depth
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 1rem", // Optional: Add padding to links
  },
};

export default Navbar;
