import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col, Form, Button } from "react-bootstrap";
import "../css/PreferenceTagsPage.css"; // Add appropriate CSS for styling
import img1 from "./logoo4.JPG";
import sidebarImage from "./logoo444.JPG";

const PreferenceTagsPage = () => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const touristId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:8000/prefTags/readtag");
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching preference tags:", error);
      }
    };
    fetchTags();
  }, []);

  const handleTagSelection = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId) ? prevTags.filter((tag) => tag !== tagId) : [...prevTags, tagId]
    );
  };

  const handleSavePreferences = async () => {
    try {
      await axios.post(
        `http://localhost:8000/home/tourist/addPreferenceTags/${touristId}`,
        { tags: selectedTags }
      );
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences.");
    }
  };

  return (
    <div className="tourist-page">
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#">
            <img src={img1} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link onClick={() => navigate("/cart")}>
                <i className="fas fa-shopping-cart"></i>
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/wishlist")}>
                <i className="fas fa-heart"></i>
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/notifications")}>
                <i className="fas fa-bell"></i>
              </Nav.Link>
              <Nav.Link>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg"
                  alt="Profile"
                  className="navbar-profile-image"
                />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="tourist-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="profile-container">
            <button className="sidebar-button" onClick={() => navigate("/tourist-home")}>
              Back
            </button>
          </div>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
          </div>
        </div>

       {/* Main Content */}
<div className="main-content">
  {/* Tags Container */}
  <div className="tags-container">
    {tags.map((tag) => (
      <label key={tag._id} className="tag-label">
        <input
          type="checkbox"
          id={tag._id}
          onChange={() => handleTagSelection(tag._id)}
          className="tag-checkbox"
        />
        <span className="custom-checkbox"></span>
        {tag.name}
      </label>
    ))}
  </div>

  {/* Save Preferences Button */}
  <Button onClick={handleSavePreferences} className="reply-button">
    Save Preferences
  </Button>
</div>

      </div>

      {/* Footer */}
      <div className="footer">
        <Container>
          <Row>
            <Col md={4}>
              <h5>Contact Us</h5>
              <p>Email: support@touristplatform.com</p>
              <p>Phone: +123 456 7890</p>
            </Col>
            <Col md={4}>
              <h5>Address</h5>
              <p>123 Explore Lane</p>
              <p>Adventure City, ExploreWorld 12345</p>
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

export default PreferenceTagsPage;