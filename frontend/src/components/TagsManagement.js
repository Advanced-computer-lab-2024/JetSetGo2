import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../App.css';

const TagsManagement = () => {
  const navigate = useNavigate(); // Create navigate function
  const [preferances, setPreferances] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editId, setEditId] = useState(null);

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/prefTags/readtag');
      setPreferances(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/prefTags/updateTagId/${editId}`, { ...formData });
      } else {
        await axios.post('http://localhost:8000/prefTags/createtag', { ...formData });
      }
      fetchTags();
      setFormData({ name: '' });
      setEditId(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (prefTags) => {
    setFormData(prefTags);
    setEditId(prefTags._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/prefTags/deletetag/${id}`);
      fetchTags();
    } catch (error) {
      console.error('Error deleting Tags:', error);
    }
  };

  // Button styles for admin navigation
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
    e.target.style.backgroundColor = '#2d3e50';
    e.target.style.transform = 'scale(1)';
  };

  return (
    <div style={styles.container}>
      {/* Sidebar with Profile and Admin Buttons */}
      <div style={styles.sidebar}>
        <div style={styles.profileContainer}>
          <img
            src="https://i.pngimg.me/thumb/f/720/c3f2c592f9.jpg"
            alt="Profile"
            style={styles.profileImage}
          />
          <h2 style={styles.profileName}>Admin</h2>
          <p>Admin</p>
          <button onClick={() => navigate('/adminCapabilities')} style={styles.button}>
            Admin Home
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          {[
            { label: 'Manage Categories', path: '/category' },
            { label: 'Manage Tags', path: '/TagsManagement' },
            { label: 'Manage Products', path: '/product' },
            { label: 'View Product List', path: '/productList' },
            { label: 'Delete Users', path: '/DeleteUsers' },
            { label: 'Add a Tourism Governor', path: '/AddTourismGovernor' },
            { label: 'Add an Admin', path: '/AddAdmin' },
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

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1>Tags Management</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tag Name"
            required
          />
          <button type="submit">{editId ? 'Update Tag' : 'Create Tag'}</button>
        </form>

        <h2>Tags</h2>
        <ul>
          {preferances.map((prefTags) => (
            <li key={prefTags._id}>
              <h3>{prefTags.name}</h3>
              <button onClick={() => handleEdit(prefTags)}>Edit</button>
              <button onClick={() => handleDelete(prefTags._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
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
  },
  profileName: {
    margin: '10px 0',
    fontSize: '18px',
  },
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    marginLeft: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
};

export default TagsManagement;
