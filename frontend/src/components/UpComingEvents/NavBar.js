// src/components/Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <a href="#activities">Activities</a>
      <a href="#itineraries">Itineraries</a>
      <a href="#places">Historical Places</a>
      <a href="#museums">Museums</a>
    </nav>
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

export default Navbar;
