import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom'; 
import { getProducts, createProduct, updateProduct, deleteProduct, getSellers } from '../services/ProductService'; 

const ProductCRUD = () => {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    pictures: '',
    price: '',
    seller: '',
    rating: 0,
    reviews: '',
    availableQuantity: '',
  });
  const [editData, setEditData] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch products and sellers when the component mounts
  useEffect(() => {
    fetchProducts();
    fetchSellers();
  }, []);

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
    } catch (error) {
      console.error("Error fetching sellers", error);
    }
  };

  // Handle form input change
  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rating change using a slider
  const handleRatingChange = (e, setData) => {
    const value = Math.max(0, Math.min(5, Number(e.target.value)));
    setData(prev => ({
      ...prev,
      rating: isNaN(value) ? 0 : value  
    }));
  };

  // Handle form submission for creating a new product
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      setMessage('Product created successfully!');
      resetCreateForm();
      fetchProducts(); 
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : 'Error occurred while creating the product';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  // Handle form submission for updating an existing product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    try {
      await updateProduct(editData._id, editData);
      setMessage('Product updated successfully!');
      resetEditForm();
      fetchProducts(); 
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : 'Error occurred while updating the product.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setMessage('Product deleted successfully!');
      fetchProducts(); 
    } catch (error) {
      setMessage('Error deleting product.');
      console.error(error);
    }
  };

  // Populate form with data for editing
  const handleEdit = (product) => {
    setEditData(product);
  };

  // Reset form for creating
  const resetCreateForm = () => {
    setFormData({
      description: '',
      pictures: '',
      price: '',
      seller: '',
      rating: 0,
      reviews: '',
      availableQuantity: '',
    });
  };

  // Reset form for editing
  const resetEditForm = () => {
    setEditData(null);
  };

  // Cancel button logic
  const handleCancel = () => {
    resetEditForm();
    navigate('/product'); // You can navigate to any page you prefer, like back to the product list
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f7f8fa',
      padding: '20px',
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        padding: '20px',
        backgroundColor: '#2d3e50',
        borderRadius: '10px',
        color: '#fff',
      }}>
        <h3>Welcome</h3>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <button onClick={() => navigate(-1)} style={{
            padding: '10px 20px',
            backgroundColor: '#ff6348',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%',
          }}>
            Back
          </button>
        </div>

        {/* View Product Button */}
        <button onClick={() => navigate("/productlist")} style={{
          padding: '10px 20px',
          backgroundColor: '#ff6348',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
          width: '100%',
          fontSize: '16px',
        }}>
          View Products
        </button>
      </div>
      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{
          fontSize: '28px',
          marginBottom: '20px',
          color: '#333',
        }}>
          Product Management
        </h2>

        {/* Display success/error message */}
        {message && <p style={{
          textAlign: 'center',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: message.includes('success') ? '#28a745' : '#dc3545',
          color: '#fff',
          fontSize: '18px',
        }}>
          {message}
        </p>}

        {/* Create Product Form */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Create New Product</h2>
          <form onSubmit={handleCreateSubmit}>
            <label style={{ display: 'block', marginBottom: '10px' }}>Description:</label>
            <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              type="text" name="description" value={formData.description} onChange={(e) => handleChange(e, setFormData)} required />
            
            <label style={{ display: 'block', marginBottom: '10px' }}>Picture (URL):</label>
            <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              type="text" name="pictures" value={formData.pictures} onChange={(e) => handleChange(e, setFormData)} required />
            
            <label style={{ display: 'block', marginBottom: '10px' }}>Price:</label>
            <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              type="number" name="price" value={formData.price} onChange={(e) => handleChange(e, setFormData)} required />
            
            <label style={{ display: 'block', marginBottom: '10px' }}>Seller:</label>
            <select style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              name="seller" value={formData.seller} onChange={(e) => handleChange(e, setFormData)} required>
              <option value="">Select a Seller</option>
              {sellers.map(seller => (
                <option key={seller._id} value={seller._id}>{seller.Name}</option>
              ))}
            </select>

            <label style={{ display: 'block', marginBottom: '10px' }}>Rating:</label>
            <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              type="range" min="0" max="5" step="0.1" value={formData.rating} onChange={(e) => handleRatingChange(e, setFormData)} />
            <span>{formData.rating.toFixed(1)}</span>

            <label style={{ display: 'block', marginBottom: '10px' }}>Reviews:</label>
            <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              type="text" name="reviews" value={formData.reviews} onChange={(e) => handleChange(e, setFormData)} required />

            <label style={{ display: 'block', marginBottom: '10px' }}>Available Quantity:</label>
            <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              type="number" name="availableQuantity" value={formData.availableQuantity} onChange={(e) => handleChange(e, setFormData)} required />

            <button style={{ padding: '10px 20px', backgroundColor: '#2d3e50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
              Create Product
            </button>
          </form>
        </section>

        {/* Edit Product Form */}
        {editData && (
          <section style={{ marginBottom: '40px' }}>
            <h2>Edit Product</h2>
            <form onSubmit={handleEditSubmit}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Description:</label>
              <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                type="text" name="description" value={editData.description} onChange={(e) => handleChange(e, setEditData)} required />

              <label style={{ display: 'block', marginBottom: '10px' }}>Picture (URL):</label>
              <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                type="text" name="pictures" value={editData.pictures} onChange={(e) => handleChange(e, setEditData)} required />

              <label style={{ display: 'block', marginBottom: '10px' }}>Price:</label>
              <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                type="number" name="price" value={editData.price} onChange={(e) => handleChange(e, setEditData)} required />

              <label style={{ display: 'block', marginBottom: '10px' }}>Seller:</label>
              <select style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                name="seller" value={editData.seller} onChange={(e) => handleChange(e, setEditData)} required>
                <option value="">Select a Seller</option>
                {sellers.map(seller => (
                  <option key={seller._id} value={seller._id}>{seller.Name}</option>
                ))}
              </select>

              <label style={{ display: 'block', marginBottom: '10px' }}>Rating:</label>
              <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                type="range" min="0" max="5" step="0.1" value={editData.rating} onChange={(e) => handleRatingChange(e, setEditData)} />
              <span>{editData.rating.toFixed(1)}</span>

              <label style={{ display: 'block', marginBottom: '10px' }}>Reviews:</label>
              <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                type="text" name="reviews" value={editData.reviews} onChange={(e) => handleChange(e, setEditData)} required />

              <label style={{ display: 'block', marginBottom: '10px' }}>Available Quantity:</label>
              <input style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                type="number" name="availableQuantity" value={editData.availableQuantity} onChange={(e) => handleChange(e, setEditData)} required />

              <button style={{ padding: '10px 20px', backgroundColor: '#2d3e50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
                Update Product
              </button>

              {/* Cancel Button */}
              <button type="button" onClick={handleCancel} style={{
                padding: '10px 20px',
                backgroundColor: '#ff6348',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                width: '100%',
              }}>
                Cancel
              </button>
            </form>
          </section>
        )}

        {/* Product List */}
        <section>
          <h2>Product List</h2>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}>
            <thead style={{
              backgroundColor: '#343a40',
              color: '#fff',
            }}>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Picture</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Description</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Price</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Seller</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Rating</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                    {product.pictures ? <img src={product.pictures} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover' }} /> : 'No Image'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.description}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>${product.price}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.seller.Name}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.rating}</td>
                  <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                    <button onClick={() => handleEdit(product)} style={{ padding: '5px 10px', backgroundColor: '#2d3e50', color: '#fff', border: 'none', borderRadius: '5px', marginRight: '10px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} style={{ padding: '5px 10px', backgroundColor: '#ff6348', color: '#fff', border: 'none', borderRadius: '5px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ProductCRUD;
