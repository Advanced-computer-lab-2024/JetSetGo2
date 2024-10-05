import React, { useState, useEffect } from 'react';
import '../App.css';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/ProductService'; // Ensure you have these service functions defined

const ProductList = () => {
  const [products, setProducts] = useState([]);
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

  
  

  return (
    <div>
      <h1>Product Management</h1>

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
          <p>Seller: {product.seller}</p>
          <p>Rating: {product.rating}</p>
          <p>Available Quantity: {product.availableQuantity}</p>
          <div className="product-actions">
            
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

export default ProductList;
