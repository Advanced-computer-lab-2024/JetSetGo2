import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TagsManagement = () => {
  const navigate = useNavigate();
  const [preferances, setPreferances] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:8000/prefTags/updatetag/${editId}`, formData);
        setMessage('Tag updated successfully!');
      } else {
        await axios.post('http://localhost:8000/prefTags/createtag', formData);
        setMessage('Tag created successfully!');
      }
      setFormData({ name: '' });
      setEditId(null);
      fetchTags(); // Refresh the list of tags
    } catch (error) {
      console.error('Error saving tag:', error);
      setMessage('Error saving tag. Please try again.');
    }
  };

  const handleEdit = (tag) => {
    setEditId(tag._id);
    setFormData({ name: tag.name });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/prefTags/deletetag/${id}`);
      setMessage('Tag deleted successfully!');
      fetchTags(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting tag:', error);
      setMessage('Error deleting tag. Please try again.');
    }
  };

  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="admin-page">
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#">
            <img src={img1} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Dropdown alignRight>
                <Dropdown.Toggle className="drop">
                  <img src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg" alt="Profile" className="navbar-profile-image" />
                  Admin
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/notifications")}>Notifications</Dropdown.Item>

                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="admin-container">
        {/* Sidebar */}
        <div className="sidebar">
          <button className="sidebar-button" onClick={() => navigate("/adminCapabilities")}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </button>
          <button className="sidebar-button" onClick={() => navigate("/fetchdocuments")}>
            <i className="fas fa-users"></i> View Users
          </button>
          <button className="sidebar-button" onClick={() => navigate("/AddAdmin")}>
            <i className="fas fa-user-plus"></i> Add An Admin
          </button>
          <button className="sidebar-button" onClick={() => navigate("/DeleteUsers")}>
            <i className="fas fa-user-cog"></i> Manage Users
          </button>
          <button className="sidebar-button" onClick={() => navigate("/AddTourismGovernor")}>
            <i className="fas fa-user-tie"></i> Tourism Governer
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/Sales-Report")}
          >
            <i className="fas fa-tachometer-alt"></i> Sales Report
          </button>
          <button className="sidebar-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar Image" className="sidebar-image" />
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2 className="section-title">Manage Tags</h2>
          <Form onSubmit={handleSubmit} className="admin-form">
            <Form.Group controlId="formTagName">
              <Form.Label>Tag Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tag name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </Form.Group>
            <Button className="addadmin-button" type="submit">
              {editId ? 'Update Tag' : 'Create Tag'}
            </Button>
          </Form>
          {message && <div className="alert alert-success">{message}</div>}

          <h2 className="section-title">Tags</h2>
          <ul className="admin-list">
            {preferances.map((prefTags) => (
              <li key={prefTags._id} className="admin-list-item">
                <h3>{prefTags.name}</h3>
                <div>
                  <button onClick={() => handleEdit(prefTags)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(prefTags._id)} className="delete-button">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-buttons">
            <button className="box" onClick={() => navigate("/category")}>Categories</button>
            <button className="box" onClick={() => navigate("/TagsManagement")}>Tags</button>
            <button className="box" onClick={() => navigate("/product")}>Products</button>
            <button className="box" onClick={() => navigate("/activitiesAdmin")}>Activities</button>
            <button className="box" onClick={() => navigate("/ItinerariesAdmin")}>Itineraries</button>
            <button className="box" onClick={() => navigate("/MuseumsAdmin")}>Museums</button>
            <button className="box" onClick={() => navigate("/HistoricalPlacesAdmin")}>Historical Places</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <Container>
          <Row>
            <Col md={4}>
              <h5>Contact Us</h5>
              <p>Email: contact@jetsetgo.com</p>
              <p>Phone: +123 456 7890</p>
            </Col>
            <Col md={4}>
              <h5>Address</h5>
              <p>123 Travel Road</p>
              <p>Adventure City, World 45678</p>
            </Col>
            <Col md={4}>
              <h5>Follow Us</h5>
              <p>Facebook | Twitter | Instagram</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default TagsManagement;