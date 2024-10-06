import React, { useState, useEffect } from 'react';
import '../App.css';
import { getProducts, createProduct, updateProduct, deleteProduct, getSellers } from '../services/ProductService'; // Ensure you have these service functions defined

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

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
    fetchSellers();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const data = await getProducts(); // Fetch products from the backend
      setProducts(data);                // Update state with fetched data
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchSellers = async () => {
    try {
      const data = await getSellers(); // Fetch sellers from the backend
      setSellers(data);                // Update state with fetched data
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
    const value = Math.max(0, Math.min(5, Number(e.target.value))); // Limit rating between 0 and 5
    setData(prev => ({
      ...prev,
      rating: isNaN(value) ? 0 : value  // Ensure it's never undefined
    }));
  };
  
  // Handle form submission for creating a new product
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      setMessage('Product created successfully!');
      resetCreateForm();
      fetchProducts(); // Fetch updated products
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : 'Error occurred while creating the product';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  // Handle form submission for updating an existing product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return; // Return if there's no editData

    try {
      await updateProduct(editData._id, editData);
      setMessage('Product updated successfully!');
      resetEditForm();
      fetchProducts(); // Fetch updated products
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
      fetchProducts(); // Fetch updated products
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

  return (
    <div>
      <h1>Product Management</h1>

      {/* Display success/error message */}
      {message && <p className="message">{message}</p>}

      {/* Form for creating a new product */}
      <section className="form-section">
        <h2>Create New Product</h2>
        <form onSubmit={handleCreateSubmit}>
          <label>Description:
            <input type="text" name="description" value={formData.description} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Picture (URL):
            <input type="text" name="pictures" value={formData.pictures} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Price:
            <input type="number" name="price" value={formData.price} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Seller:
            <select name="seller" value={formData.seller} onChange={(e) => handleChange(e, setFormData)} required>
              <option value="">Select a Seller</option>
              {sellers.map(seller => (
                <option key={seller._id} value={seller._id}>{seller.Name}</option> 
              ))}
            </select>
          </label>
          <label>Rating:
  <input
    type="range"
    min="0"
    max="5"
    step="0.1"
    value={formData.rating}
    onChange={(e) => handleRatingChange(e, setFormData)} // Pass setFormData here
  />
  <span>{(formData.rating !== undefined ? formData.rating : 0).toFixed(1)}</span> {/* Display the current rating */}
</label>
          <label>Reviews:
            <input type="text" name="reviews" value={formData.reviews} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Available Quantity:
            <input type="number" name="availableQuantity" value={formData.availableQuantity} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <button type="submit">Create Product</button>
        </form>
      </section>

      {/* Form for editing an existing product */}
      {editData && (
        <section className="form-section">
          <h2>Edit Product</h2>
          <form onSubmit={handleEditSubmit}>
            <label>Description:
              <input type="text" name="description" value={editData.description} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Picture (URL):
              <input type="text" name="pictures" value={editData.pictures} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Price:
              <input type="number" name="price" value={editData.price} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Seller:
              <select name="seller" value={editData.seller} onChange={(e) => handleChange(e, setEditData)} required>
                <option value="">Select a Seller</option>
                {sellers.map(seller => (
                  <option key={seller._id} value={seller._id}>{seller.Name}</option>
                ))}
              </select>
            </label>
            <label>Rating:
  <input
    type="range"
    min="0"
    max="5"
    step="0.1"
    value={editData.rating}
    onChange={(e) => handleRatingChange(e, setEditData)} // Pass setEditData here
  />
  <span>{editData.rating.toFixed(1)}</span> {/* Display the current rating */}
</label>
            <label>Reviews:
              <input type="text" name="reviews" value={editData.reviews} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Available Quantity:
              <input type="number" name="availableQuantity" value={editData.availableQuantity} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <button type="submit">Update Product</button>
            <button type="button" onClick={resetEditForm}>Cancel Edit</button>
          </form>
        </section>
      )}

      {/* List of products */}
      <section className="product-list">
  <h2>Product List</h2>
  {products.length > 0 ? (
    <ul>
      {products.map((product) => (
        <li key={product._id} className="product-item">
          <h3>{product.description}</h3>
          <img src={product.pictures} alt={product.description} style={{ width: '100px', height: 'auto' }} /> {/* Display the image */}
          <p>Price: ${product.price}</p>
          <p>Seller: {product.seller.Name}</p> {/* Access seller's Name */}
          <p>Rating: {product.rating}</p>
          <p>Available Quantity: {product.availableQuantity}</p>
          <div className="product-actions">
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No products found.</p>
  )}
</section>

    </div>
  );
};

export default ProductCRUD;
