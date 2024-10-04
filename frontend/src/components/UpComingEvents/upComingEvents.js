// src/pages/UpcomingEvents.js
import React from 'react';
import { Link } from 'react-router-dom';

const UpcomingEvents = () => {
  return (
    <div>
      <nav style={styles.navbar}>
        <Link to="/Upcoming-activities" style={styles.link}>Activities</Link>
        <Link to="/itineraries" style={styles.link}>Itineraries</Link>
        <Link to="/places" style={styles.link}>Historical Places</Link>
        <Link to="/museums" style={styles.link}>Museums</Link>
      </nav>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    padding: '1rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
};

export default UpcomingEvents;
