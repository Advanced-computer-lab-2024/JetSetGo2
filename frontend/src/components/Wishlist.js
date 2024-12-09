import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import sidebarImage from "./logoo444.JPG";
import img1 from "./logoo4.JPG";
import "../css/Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/home/tourist/${userId}/wishlist`
      );
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/home/tourist/${userId}/wishlist/remove`,
        { productId }
      );


      
      setMessage(response.data.message);
      fetchWishlist();
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="tour-guide-page">
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#" className="navbar-brand">
            <img src={img1} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
          <Nav className="ml-auto">
         
          </Nav>
        </Container>
      </Navbar>

      {/* Main Container */}
      <div className="admin-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="profile-container">
            
            <button className="sidebar-button" onClick={handleBackClick}>
              Back
            </button>
          </div>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h1 className="wishlist-title">Your Wishlist</h1>
          {message && <p className="wishlist-message">{message}</p>}
          {wishlist.length > 0 ? (
            <div className="wishlist-grid">
              {wishlist.map((product) => (
                <div key={product._id} className="wishlist-card">
                  <img
                    src={product.pictures || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="wishlist-card-image"
                  />
                  
                  <div className="wishlist-card-content">
                    <h3 className="wishlist-card-title">Product Name :{product.description}</h3>
                    <p className="wishlist-card-price">Quantity :{product.availableQuantity}</p>
                    <p className="wishlist-card-price">Product Price : ${product.price}</p>
                    <button
                      className="wishlist-remove-button"
                      onClick={() => handleRemove(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="wishlist-empty">Your wishlist is empty.</p>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-buttons">
            
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

export default Wishlist;