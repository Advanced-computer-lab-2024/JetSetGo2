import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCapabilities = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    margin: '10px',
    padding: '10px 20px', // Reduced padding for smaller buttons
    fontSize: '16px', // Adjusted font size for smaller buttons
    backgroundColor: '#2d3e50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s, transform 0.3s',
    width: '180px', // Ensures all buttons have equal width
    textAlign: 'center',
  };

  const handleHover = (e) => {
    e.target.style.backgroundColor = '#0056b3';
    e.target.style.transform = 'scale(1.05)';
  };

  const handleLeave = (e) => {
    e.target.style.backgroundColor = '#007BFF';
    e.target.style.transform = 'scale(1)';
  };

  const handleUpdateClick = () => {
    navigate('/admin-update');
  };

  const adminData = {
    UserName: 'Admin',
    
  };

  return (
    <div style={styles.container}>
      {/* Sidebar with Profile */}
      <div style={styles.sidebar}>
        <div style={styles.profileContainer}>
          <img
            src="https://i.pngimg.me/thumb/f/720/c3f2c592f9.jpg"
            alt="Profile"
            style={styles.profileImage}
          />
          <h2 style={styles.profileName}>{adminData.UserName}</h2>
          <p>Admin</p>
          <button style={styles.button} onClick={() => navigate("/")}>
          Home
        </button>
          
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.header}>Admin Capabilities</h1>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Manage Categories', path: '/category' },
            { label: 'Manage Tags', path: '/TagsManagement' },
            { label: 'Manage Products', path: '/product' },
            { label: 'View Product List', path: '/productList' },
            { label: 'Delete Users', path: '/DeleteUsers' },
            { label: 'Add a Tourism Governor', path: '/AddTourismGovernor' },
            { label: 'Add an Admin', path: '/AddAdmin' },
            { label: 'Manage Itineraries', path: '/ItinerariesAdmin' },
            { label: 'Manage Activities', path: '/ActivitiesAdmin' },
            { label: 'Fetch Documents', path: '/fetchdocuments' },
            
          ].map((button) => (
            <button
              key={button.path}
              style={buttonStyle}
              onClick={() => navigate(button.path)}
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f7f8fa',
    padding: '20px',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2d3e50',
    padding: '20px',
    borderRadius: '10px',
    color: '#fff',
  },
  profileContainer: {
    textAlign: 'center',
  },
  profileImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginBottom: '15px',
    border: '3px solid #fff',
  },
  profileName: {
    fontSize: '22px',
    fontWeight: 'bold',
  },
  walletText: {
    fontSize: '18px',
    margin: '10px 0',
  },
  button: {
    backgroundColor: '#ff6348',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  mainContent: {
    flex: 1,
    marginLeft: '30px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
};

export default AdminCapabilities;
