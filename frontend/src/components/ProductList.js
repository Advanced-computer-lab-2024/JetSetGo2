import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate ,Link} from 'react-router-dom';
import { getProducts } from '../services/ProductService';
import axios from 'axios'; // Don't forget to import axios
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from './logoo444.JPG';
import "./SellerPage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
      console.log(filteredProducts);
    } catch (error) {
      setMessage('Error fetching products');
      console.error("Error fetching products", error);
    }
  };

  // Archive a product
  const handleArchive = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/product/archive/${id}`);
      setMessage('Product archived successfully!');
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error archiving product:", error);
      setMessage('Error archiving product.');
    }
  };

  // Unarchive a product
  const handleUnarchive = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/product/unarchive/${id}`);
      setMessage('Product unarchived successfully!');
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error unarchiving product:", error);
      setMessage('Error unarchiving product.');
    }
  };

  const filterProducts = (searchTerm, minPrice, maxPrice, sortOrder) => {
    let filtered = products.filter(product => {
      const matchesSearch = product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = (minPrice === '' || product.price >= parseFloat(minPrice)) &&
        (maxPrice === '' || product.price <= parseFloat(maxPrice));
      return matchesSearch && matchesPrice;
    });

    filtered.sort((a, b) => {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="seller-page">
    {/* Navbar */}
    <Navbar className="navbar1">
      <Container>
        <Navbar.Brand href="#" className="navbar-brand">
          <img src={img1} alt="Logo" className="navbar-logo" />
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Link to="/Upcoming-activities" className="nav-link">
            Activities
          </Link>
          <Link to="/Upcoming-itineraries" className="nav-link">
            Itineraries
          </Link>
          <Link to="/all-historicalplaces" className="nav-link">
            Historical Places
          </Link>
          <Link to="/all-museums" className="nav-link">
            Museums
          </Link>
        </Nav>
      </Container>
    </Navbar>
  
    {/* Container for Sidebar and Main Content */}
    <div className="seller-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-container">
          <h3>Welcome</h3>
          <button onClick={() => navigate(-1)} className="sidebar-button">
            Back
          </button>
          <button onClick={() => navigate("/product")} className="sidebar-button">
            Add/Edit Product
          </button>
        </div>
        <div className="sidebar-image-container">
          <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
        </div>
      </div>
  
      {/* Main Content */}
      <div className="main-content">
      <h2 class="center-heading">Product Management</h2>

  
        {/* Search and Filter Controls */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filterProducts(e.target.value, minPrice, maxPrice, sortOrder);
            }}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginRight: "10px",
            }}
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              filterProducts(searchTerm, e.target.value, maxPrice, sortOrder);
            }}
            style={{
              padding: "10px",
              width: "150px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginRight: "10px",
            }}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              filterProducts(searchTerm, minPrice, e.target.value, sortOrder);
            }}
            style={{
              padding: "10px",
              width: "150px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>
  
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              filterProducts(searchTerm, minPrice, maxPrice, e.target.value);
            }}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              backgroundColor: "#fff",
            }}
          >
            <option value="asc">Sort by Rating: Low to High</option>
            <option value="desc">Sort by Rating: High to Low</option>
          </select>
        </div>
  
        {/* Product Table */}
        <section>
          <h3>Product List</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Picture</th>
                <th>Description</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Rating</th>
                <th>Available Quantity</th>
                <th>Sales</th>
                <th>Reviews</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.pictures && product.pictures.length > 0 ? (
                        <img
                          src={`data:image/png;base64,${product.pictures}`}
                          alt="Product"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{product.description}</td>
                    <td>{product.price} $</td>
                    <td>
                      {product.seller && product.seller.Name
                        ? product.seller.Name
                        : "Unknown Seller"}
                    </td>
                    <td>{product.avgRating || "No rating"}</td>
                    <td>{product.availableQuantity}</td>
                    <td>{product.sales}</td>
                    <td>
                      {product.reviewsText && product.reviewsText.length > 0 ? (
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                          {product.reviewsText.map((review, index) => (
                            <li key={index} style={{ marginBottom: "5px" }}>
                              - {review}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No reviews available"
                      )}
                    </td>
                    <td>
                      {product.isArchived ? (
                        <button
                          onClick={() => handleUnarchive(product._id)}
                          className="sidebar-button"
                        >
                          Unarchive
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(product._id)}
                          className="sidebar-button"
                        >
                          Archive
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ padding: "20px", textAlign: "center" }}>
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
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
}  

export default ProductList;
