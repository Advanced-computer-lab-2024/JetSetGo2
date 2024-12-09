import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createAdmin, deleteAdmin } from "../services/AdminService";
import { Navbar, Nav, Container, Row, Col, Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AddAdmin = () => {
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [admins, setAdmins] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminData = { Username, Email, Password };
      await createAdmin(adminData);
      setMessage("Admin created successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      fetchAdmins(); // Refresh the list of admins after adding a new one
    } catch (error) {
      setMessage("Error creating admin. Please try again.");
      console.error("Error creating admin:", error);
    }
  };

  // Fetch all admins from the backend
  const fetchAdmins = async () => {
    try {
      const response = await fetch("http://localhost:8000/admin/get");
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setMessage("Error fetching admin list.");
    }
  };

  // Handle deletion of an admin
  const handleDelete = async (id) => {
    try {
      await deleteAdmin(id);
      alert("Admin deleted successfully!");
      fetchAdmins(); // Refresh the list after deletion
    } catch (error) {
      alert("Error deleting admin. Please try again.");
    }
  };

  // Fetch the admins when the component is first rendered
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const adminId = localStorage.getItem("userId");
    console.log("Admin ID:", adminId); // Log adminId to ensure it's not null or undefined
  
    if (!adminId) {
      alert("Admin ID is missing. Please check.");
      return;
    }
  
    try {
      await axios.put(`http://localhost:8000/admin/update-password/${adminId}`, {
        newPassword,
      });
      alert("Password updated successfully");
      setPasswordChanged(true);
      setShowPasswordChange(false);
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
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

                  <Dropdown.Item onClick={() => setShowPasswordChange(true)}>Change Password</Dropdown.Item>
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
          <button className="sidebar-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar Image" className="sidebar-image" />
          </div>
        </div>

        {/* Main Content */}
<div className="main-content">
  {showPasswordChange && (
    <div className="password-change-container">
      <h2>Change Password</h2>
      <Form onSubmit={handlePasswordChange}>
        <Form.Group controlId="formNewPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {passwordChanged && <p className="success-message">Password changed successfully!</p>}
    </div>
  )}
  <h2 className="section-title">Add New Admin</h2>
  <Form onSubmit={handleSubmit} className="admin-form">
    <Form.Group controlId="formUserName">
      <Form.Label>User Name</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter user name"
        name="UserName"
        value={Username}
        onChange={(e) => setUsername(e.target.value)}
        className="form-input"
      />
    </Form.Group>
    <Form.Group controlId="formEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        placeholder="Enter email"
        name="Email"
        value={Email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
      />
    </Form.Group>
    <Form.Group controlId="formPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        placeholder="Enter password"
        name="Password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
      />
    </Form.Group>
    <Button className="addadmin-button" type="submit">
      Add Admin
    </Button>
  </Form>
  {message && <div className="alert alert-success">{message}</div>}

  <h2 className="section-title">Admins On System</h2>
  <ul className="admin-list">
    {admins.map((admin) => (
      <li key={admin._id} className="admin-list-item">
        {admin.Username}
        <button
          onClick={() => handleDelete(admin._id)}
          className="delete-button"
        >
          Delete
        </button>
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

export default AddAdmin;