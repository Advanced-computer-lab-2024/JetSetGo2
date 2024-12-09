import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { useNavigate , Link} from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellers,
  getAdmins,
} from "../services/ProductService";
import axios from "axios";
import { Navbar, Nav, Container, Row, Col, Dropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ProductCRUD = () => {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    pictures: "",
    price: "",
    sellerId: "",
    availableQuantity: "",
  });
  const [editData, setEditData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const fileInputRef = useRef(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch products and sellers when the component mounts
  useEffect(() => {
    fetchProducts();
    fetchSellers();
    fetchAdmins();
  }, []);

  const userId = localStorage.getItem("userId");

  // Archive a product
  const handleArchive = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/product/archive/${id}`);
      setMessage("Product archived successfully!");
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error archiving product:", error);
      setMessage("Error archiving product.");
    }
  };

  // Unarchive a product
  const handleUnarchive = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/product/unarchive/${id}`);
      setMessage("Product unarchived successfully!");
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error unarchiving product:", error);
      setMessage("Error unarchiving product.");
    }
  };
  const handleRatingChange = (e, setData) => {
    const value = Math.max(0, Math.min(5, Number(e.target.value)));
    setData((prev) => ({
      ...prev,
      rating: isNaN(value) ? 0 : value,
    }));
  };

  const determineSeller = () => {
    const seller = sellers.find((seller) => seller._id === userId);
    const admin = admins.find((admin) => admin._id === userId);

    if (seller) {
      return seller._id;
    } else if (admin) {
      const adminSeller = sellers.find((s) => s.UserName === "Admin"); // Find seller with username "admin"
      return adminSeller ? adminSeller._id : "";
    }
    return "";
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchSellers = async () => {
    try {
      const data = await getSellers();
      setSellers(data);
      console.log(sellers);
    } catch (error) {
      console.error("Error fetching sellers", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
      console.log(admins);
    } catch (error) {
      console.error("Error fetching admins", error);
    }
  };

  // Handle form input change
  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for creating a new product
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    // Set the seller ID based on user role
    const sellerId = userId;
    if (!sellerId) {
      setMessage("Error: Seller ID could not be determined.");
      return;
    }

    try {
      await createProduct({ ...formData, sellerId });
      setMessage("Product created successfully!");
      resetCreateForm();
      fetchProducts();
      setImagePreview(null);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error
        : "Error occurred while creating the product";
      setMessage(errorMessage);
      console.error("Error:", error);
    }
  };

  // Handle form submission for updating an existing product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    try {
      await updateProduct(editData._id, editData);
      setMessage("Product updated successfully!");
      resetEditForm();
      fetchProducts();

      // Clear the file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input
      }
      setImagePreview(null); // Clear the image preview
      console.log(formData); // Logging formData
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error
        : "Error occurred while updating the product.";
      setMessage(errorMessage);
      console.error(error);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setMessage("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      setMessage("Error deleting product.");
      console.error(error);
    }
  };

  const handleImageUpload = (event, setData) => {
    const file = event.target.files[0];
    if (file) {
      // You might need to convert the image file to a URL or base64 format
      const reader = new FileReader();
      reader.onloadend = () => {
        // Assuming you want to store the image as a string URL
        setData((prevData) => ({
          ...prevData,
          pictures: reader.result, // Store the image URL in formData
        }));
        setImagePreview(reader.result);
        console.log(imagePreview);
      };
      reader.readAsDataURL(file); // Convert file to base64 URL
    }
  };

  // Populate form with data for editing
  const handleEdit = (product) => {
    setEditData(product);
  };

  // Reset form for creating
  const resetCreateForm = () => {
    setFormData({
      description: "",
      pictures: "",
      price: "",
      sellerId: "",
      availableQuantity: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset form for editing
  const resetEditForm = () => {
    setEditData(null);
  };

  // Cancel button logic
  const handleCancel = () => {
    resetEditForm();
    navigate("/product"); // You can navigate to any page you prefer, like back to the product list
  };

  return (
    <div
      className="admin-page"
    >
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#">
            <img src={img1} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="admin-container">

        {/* Sidebar */}
        <div className="sidebar">
        <button 
      onClick={() => navigate(-1)} 
      className="sidebar-button"
    
    >
      Back
    </button>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar Image" className="sidebar-image" />
          </div>
        </div>

      {/* Main content */}
      <div
        className="main-content"
      >
        <h2>
          Product Management
        </h2>

        {/* Display success/error message */}
        {message && (
          <p
            style={{
              textAlign: "center",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "4px",
              backgroundColor: message.includes("success")
                ? "#28a745"
                : "#dc3545",
              color: "#fff",
              fontSize: "18px",
            }}
          >
            {message}
          </p>
        )}

        {/* Create Product Form */}
        <section className="admin-form">
          <p>Create New Product</p>
          <form onSubmit={handleCreateSubmit}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Description:
            </label>
            <input
              
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            <label style={{ display: "block", marginBottom: "10px" }}>
              Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setFormData)}
              ref={fileInputRef} // Attach the reference here
              required
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" width="100" />
            )}{" "}
            {/* Image preview */}
            <label style={{ display: "block", marginBottom: "10px" }}>
              Price:
            </label>
            <input
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            
            <label style={{ display: "block", marginBottom: "10px" }}>
              Available Quantity:
            </label>
            <input
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              type="number"
              name="availableQuantity"
              value={formData.availableQuantity}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
            <button
              type="submit"
             className="addadmin-button"
            >
              Create Product
            </button>
          </form>
        </section>

        {/* Edit Product Form */}
        {editData && (
          <section style={{ marginBottom: "40px" }}>
            <h2>Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Description:
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                type="text"
                name="description"
                value={editData.description}
                onChange={(e) => handleChange(e, setEditData)}
                required
              />
              <label style={{ display: "block", marginBottom: "10px" }}>
                Picture:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setEditData)}
                ref={fileInputRef} // Attach the reference here
                required
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" width="100" />
              )}{" "}
              {/* Image preview */}
              <label style={{ display: "block", marginBottom: "10px" }}>
                Price:
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                type="number"
                name="price"
                value={editData.price}
                onChange={(e) => handleChange(e, setEditData)}
                required
              />
              
              <label style={{ display: "block", marginBottom: "10px" }}>
                Available Quantity:
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                type="number"
                name="availableQuantity"
                value={editData.availableQuantity}
                onChange={(e) => handleChange(e, setEditData)}
                required
              />
              <button
                className="addadmin-button"
              >
                Update Product
              </button>
              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                className="back-button"
              >
                Cancel
              </button>
            </form>
          </section>
        )}

        {/* Product List */}
        <section className="complaint-card">
          <h2>Product List</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {/* Product Image */}
                <div style={{ height: "200px", overflow: "hidden" }}>
                  {product.pictures ? (
                    <>
                      {/*console.log("Product Picture URL:", product.pictures)*/}{" "}
                      {/* Log the URL */}
                      <img
                        src={`data:image/png;base64,${product.pictures}`}
                        alt="Product"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      />
                    </>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8f9fa",
                        color: "#6c757d",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div style={{ padding: "15px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      marginBottom: "10px",
                      color: "#2d3e50",
                    }}
                  >
                    {product.description}
                  </h3>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#28a745",
                      margin: "5px 0",
                    }}
                  >
                    ${product.price}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6c757d",
                      margin: "5px 0",
                    }}
                  >
                    Seller: {product.sellerDetails?.name || "N/A"}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#ffc107",
                      margin: "5px 0",
                    }}
                  >
                    Rating: {product.avgRating || "No rating"}
                  </p>

                  {/* Product Reviews */}
                  <div style={{ marginTop: "10px" }}>
                    <h4
                      style={{
                        fontSize: "16px",
                        color: "#2d3e50",
                        marginBottom: "5px",
                      }}
                    >
                      Reviews:
                    </h4>
                    {product.reviewsText && product.reviewsText.length > 0 ? (
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {product.reviewsText.map((review, index) => (
                          <li
                            key={index}
                            style={{
                              fontSize: "14px",
                              color: "#6c757d",
                              backgroundColor: "#f8f9fa",
                              padding: "8px",
                              borderRadius: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {review}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: "14px", color: "#6c757d" }}>
                        No reviews yet.
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(product)}
                      className="addadmin-button"
                      
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="addadmin-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
};

export default ProductCRUD;
