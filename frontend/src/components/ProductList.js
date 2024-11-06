import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/ProductService';
import axios from 'axios'; // Don't forget to import axios

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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f8fa', padding: '20px' }}>
      <div style={{ width: '250px', padding: '20px', backgroundColor: '#2d3e50', borderRadius: '10px', color: '#fff' }}>
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
          }}>Back</button>
        </div>
        <button onClick={() => navigate("/product")} style={{
          padding: '10px 20px',
          backgroundColor: '#ff6348',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
          width: '100%',
          fontSize: '16px',
        }}>Add/Edit Product</button>
      </div>

      <div style={{ flex: 1, marginLeft: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>Product Management</h2>
        {message && <p style={{
          textAlign: 'center',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: message.includes('success') ? '#28a745' : '#dc3545',
          color: '#fff',
          fontSize: '18px',
        }}>{message}</p>}

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <input type="text" placeholder="Search by product name" value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filterProducts(e.target.value, minPrice, maxPrice, sortOrder);
            }}
            style={{
              padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc',
              fontSize: '16px', marginRight: '10px',
            }} />
          <input type="number" placeholder="Min Price" value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              filterProducts(searchTerm, e.target.value, maxPrice, sortOrder);
            }}
            style={{
              padding: '10px', width: '150px', borderRadius: '5px', border: '1px solid #ccc',
              fontSize: '16px', marginRight: '10px',
            }} />
          <input type="number" placeholder="Max Price" value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              filterProducts(searchTerm, minPrice, e.target.value, sortOrder);
            }}
            style={{ padding: '10px', width: '150px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <select value={sortOrder} onChange={(e) => {
            setSortOrder(e.target.value);
            filterProducts(searchTerm, minPrice, maxPrice, e.target.value);
          }}
            style={{
              padding: '10px', borderRadius: '5px', border: '1px solid #ccc',
              fontSize: '16px', backgroundColor: '#fff',
            }}>
            <option value="asc">Sort by Rating: Low to High</option>
            <option value="desc">Sort by Rating: High to Low</option>
          </select>
        </div>

        <section>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>Product List</h2>
          <table style={{
            width: '100%', borderCollapse: 'collapse', marginTop: '20px', borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}>
            <thead style={{ backgroundColor: '#343a40', color: '#fff' }}>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Picture</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Description</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Price</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Seller</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Rating</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Available Quantity</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Sales</th>
                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Actions</th> {/* New Actions column */}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product._id} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                      {product.pictures && product.pictures.length > 0 ? (
                        <img 
                          src={`data:image/png;base64,${product.pictures}`} 
                          alt="Product" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.description}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.price} $</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                      {product.seller && product.seller.Name ? product.seller.name : 'Unknown Seller'}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.rating}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.availableQuantity}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.sales}</td>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
                      {product.isArchived ? (
                        <button onClick={() => handleUnarchive(product._id)} style={{
                          padding: '5px 10px',
                          backgroundColor: '#ffc107',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}>Unarchive</button>
                      ) : (
                        <button onClick={() => handleArchive(product._id)} style={{
                          padding: '5px 10px',
                          backgroundColor: '#ffc107',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}>Archive</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No products available</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ProductList;
