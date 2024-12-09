import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../services/CategoryService';
import { Navbar, Nav, Container, Row, Col, Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CategoryCRUD = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ name: '' });
  const [editData, setEditData] = useState(null);

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const data = await getCategory(); // Fetch categories from the backend
      setCategories(data);               // Update state with fetched data
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Handle form submission for creating or updating a category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await updateCategory(editData._id, formData);
        setMessage('Category updated successfully!');
      } else {
        await createCategory(formData);
        setMessage('Category created successfully!');
      }
      setFormData({ name: '' });
      setEditData(null);
      fetchCategories(); // Refresh the list of categories
    } catch (error) {
      console.error("Error saving category", error);
      setMessage('Error saving category. Please try again.');
    }
  };

  // Handle deletion of a category
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setMessage('Category deleted successfully!');
      fetchCategories(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting category", error);
      setMessage('Error deleting category. Please try again.');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle edit button click
  const handleEdit = (category) => {
    setEditData(category);
    setFormData({ name: category.name });
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
          
          <button className="sidebar-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar Image" className="sidebar-image" />
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2 className="section-title">Manage Categories</h2>
          <Form onSubmit={handleSubmit} className="admin-form">
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </Form.Group>
            <Button className="addadmin-button" type="submit">
              {editData ? 'Update Category' : 'Add Category'}
            </Button>
          </Form>
          {message && <div className="alert alert-success">{message}</div>}

          <h2 className="section-title">Category List</h2>
          <ul className="admin-list">
            {categories.map((category) => (
              <li key={category._id} className="admin-list-item">
                {category.name}
                <div>
                  <button
                    onClick={() => handleEdit(category)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
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

export default CategoryCRUD;