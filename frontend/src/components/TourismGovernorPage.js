import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TourismGovernorPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const buttonStyle = {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#2d3e50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s, transform 0.3s',
    width: '180px',
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

  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  const handlePasswordChange = () => {
    localStorage.setItem("tourismGovernorPassword", newPassword); // Store new password in localStorage
    setNewPassword("");
    setIsChangingPassword(false);
    alert("Password changed successfully!");
  };

  const adminData = {
    UserName: 'Tourism Governor',
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
          <p>Tourism Governor</p>
          
          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button> {/* Logout Button */}
          
          <button
            style={{ ...styles.button, marginTop: '15px' }}
            onClick={() => setIsChangingPassword(!isChangingPassword)}
          >
            Change Password
          </button>
          
          {isChangingPassword && (
            <div style={{ marginTop: '10px' }}>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ padding: '8px', width: '100%', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <button
                style={styles.button}
                onClick={handlePasswordChange}
              >
                Save New Password
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.header}>Hello Tourism Governor</h1>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Historical Places', path: '/historicalplaces' },
            { label: 'Museum', path: '/museums' },
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

export default TourismGovernorPage;
