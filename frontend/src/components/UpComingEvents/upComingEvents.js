// src/pages/UpcomingEvents.js
import React from "react";
import { Link } from "react-router-dom";

const UpcomingEvents = () => {
  return (
    <div>
      <nav style={styles.navbar}>
        <Link to="/Upcoming-activities" style={styles.link}>
          Activities
        </Link>
        <Link to="/Upcoming-itineraries" style={styles.link}>
          Itineraries
        </Link>
        <Link to="/all-historicalplaces" style={styles.link}>
          Historical Places
        </Link>
        <Link to="/all-museums" style={styles.link}>
          Museums
        </Link>
      </nav>
    </div>
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

export default UpcomingEvents;
