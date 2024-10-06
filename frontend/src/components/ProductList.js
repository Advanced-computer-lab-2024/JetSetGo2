import React, { useState, useEffect } from 'react';
import '../App.css';
import { getProducts } from '../services/ProductService'; // Ensure you have these service functions defined

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Default to ascending
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const data = await getProducts(); // Fetch products from the backend
      setProducts(data);                // Update state with fetched data
      setFilteredProducts(data);        // Initialize filtered products with fetched data
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Handle search term change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts(value, minPrice, maxPrice, sortOrder);
  };

  // Handle price filter change
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    filterProducts(searchTerm, e.target.value, maxPrice, sortOrder);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    filterProducts(searchTerm, minPrice, e.target.value, sortOrder);
  };

  // Handle sort order change
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    filterProducts(searchTerm, minPrice, maxPrice, e.target.value);
  };

  // Filter and sort products
  const filterProducts = (searchTerm, minPrice, maxPrice, sortOrder) => {
    let filtered = products.filter(product => {
      const matchesSearch = product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = (minPrice === '' || product.price >= parseFloat(minPrice)) &&
                           (maxPrice === '' || product.price <= parseFloat(maxPrice));
      return matchesSearch && matchesPrice;
    });

    // Sort products by rating
    filtered.sort((a, b) => {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    });

    setFilteredProducts(filtered);
  };

  return (
    <div>
      <h1>Product Management</h1>

      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Price filter */}
      <div>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={handleMinPriceChange}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
        />
      </div>

      {/* Sort by rating */}
      <div>
        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Sort by Rating: Low to High</option>
          <option value="desc">Sort by Rating: High to Low</option>
        </select>
      </div>

      {/* List of products */}
      <section className="product-list">
        <h2>Product List</h2>
        {filteredProducts.length > 0 ? (
          <ul>
            {filteredProducts.map((product) => (
              <li key={product._id} className="product-item">
                <h3>{product.description}</h3>
                <img src={product.pictures} alt={product.description} style={{ width: '100px', height: 'auto' }} />
                <p>Price: ${product.price}</p>
                <p>Seller: {typeof product.seller === 'object' ? product.seller.name : product.seller}</p>
                <p>Rating: {product.rating}</p>
                <p>Available Quantity: {product.availableQuantity}</p>
                <div className="product-actions">
                  {/* Add product action buttons here */}
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
