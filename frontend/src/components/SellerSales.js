import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import sidebarImage from "./logoo444.JPG";
import "./TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs, Form } from "react-bootstrap";
import img1 from "./logoo4.JPG";

const SellerRevenuePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("revenueDashboard");

  const navigate = useNavigate();
  const sellerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSellerRevenue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/seller/revenue/${sellerId}`
        );

        setProducts(response.data.products);
        setFilteredProducts(response.data.products);

        const total = response.data.products.reduce((acc, product) => {
          return acc + product.sales * product.price * 0.9;
        }, 0);

        setTotalRevenue(total);
      } catch (error) {
        console.error("Error fetching seller revenue:", error);
        setError("Failed to load seller revenue data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerRevenue();
  }, [sellerId]);

  useEffect(() => {
    let filtered = products;

    if (productFilter) {
      filtered = filtered.filter((product) =>
        product.description?.toLowerCase().includes(productFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (product) =>
          new Date(product.date).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    if (monthFilter) {
      filtered = filtered.filter(
        (product) =>
          new Date(product.date).getFullYear() ===
            new Date(monthFilter).getFullYear() &&
          new Date(product.date).getMonth() === new Date(monthFilter).getMonth()
      );
    }

    setFilteredProducts(filtered);

    const total = filtered.reduce((acc, product) => {
      return acc + product.sales * product.price * 0.9;
    }, 0);
    setTotalRevenue(total);
  }, [productFilter, dateFilter, monthFilter, products]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
         ` http://localhost:8000/seller/deleteAccount/${sellerId}`
        );

        if (response.status === 200) {
          alert(response.data.message);
          navigate("/login");
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred while deleting the account.");
        }
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tour-guide-page">
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#" className="navbar-brand">
            <img src={img1} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
          <Nav className="ml-auto">
           
          </Nav>
        </Container>
      </Navbar>

      <div className="admin-container">
        <div className="sidebar">
          <div className="profile-container">
            <button className="sidebar-button" onClick={handleLogout}>
              Logout
            </button>
            
            
            <button className="sidebar-button" onClick={handleBackClick}>
              Back
            </button>
          </div>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
          </div>
        </div>

        <div className="main-content">
          <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="admin-tabs">
            <Tab eventKey="revenueDashboard" title="Revenue Dashboard">
              <div className="form-container">
                <div className="dashboard-header">
                  <h3 className="total-revenue">Total Revenue: ${totalRevenue.toFixed(2)}</h3>
                </div>

                <div className="filters-container">
                  <input
                    type="text"
                    placeholder="Filter by product name"
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="filter-input"
                  />
                  <input
                    type="date"
                    placeholder="Filter by date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="filter-input"
                  />
                  <input
                    type="month"
                    placeholder="Filter by month"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="products-container">
                  <h3>Sold Products</h3>
                  {filteredProducts.length > 0 ? (
                    <div className="product-cards">
                      {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card">
                          <h4>{product.description || "Unnamed Product"}</h4>
                          <p>Price: ${product.price || 0}</p>
                          <p>Sales Count: {product.sales || 0}</p>
                          <p>
                            Revenue from this product: $
                            {(product.price * product.sales * 0.9).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No products found for this seller.</p>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        <div className="right-sidebar">
          <div className="sidebar-buttons">
          </div>
        </div>
      </div>

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

export default SellerRevenuePage;