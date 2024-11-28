import React, { useState, useEffect } from 'react';
import '../App.css'; // Assuming you still want to keep this for other styles
import { useNavigate } from 'react-router-dom'; 
import { getProducts,buyProduct } from '../services/ProductService'; // Ensure you have this service function defined
import axios from 'axios';

const ProductListp = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [message, setMessage] = useState('');
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [touristData,setTouristData] = useState([]);
  const [purchasedProductDetails, setPurchasedProductDetails] = useState([]);
  const [cart, setCart] = useState([]);

  const API_URL = "http://localhost:8000";
  
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
    fetchTouristData();
    fetchPurchasedProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(); 
      // Filter out archived products
      const unarchivedProducts = data.filter(product => !product.isArchived);
      setProducts(unarchivedProducts);                
      setFilteredProducts(unarchivedProducts);
    } catch (error) {
      setMessage('Error fetching products');
      console.error("Error fetching products", error);
    }
  };
  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
        const response = await axios.get(`${API_URL}/cart/${userId}`);
        setCart(response.data);
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
};
const handleAddToCart = async (productId) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
      setMessage("Please log in to add items to your cart.");
      return;
  }

  try {
      const response = await axios.post(`${API_URL}/cart/add/${userId}/${productId}`);
      setCart(response.data.cart); // Update the cart state
      setMessage("Product added to cart successfully!");
  } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage("Failed to add product to cart.");
  }
};


  const handleBuyProduct = async (userId,productId) => {
    try {
      const product = products.find(p => p._id === productId);
      if (product.availableQuantity > 0) {
        // Call your API to buy the product
        await buyProduct(userId,productId);
        setMessage('Product purchased successfully!');
        fetchProducts(); // Re-fetch products to update the available quantity
      } else {
        setMessage('Sorry, this product is out of stock.');
      }
    } catch (error) {
      setMessage('Error purchasing product');
      console.error("Error purchasing product", error);
    }
  };

  const handleBooking = async (productId) => {
    const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
    if (!userId) {
      setMessage("User ID not found in local storage. Please log in.");
      return;
    }

    try {
      // Make an API call to book the transportation and pass touristId and transportationId
      const response = await axios.post(
        `${API_URL}/home/tourist/buyProduct/${userId}/${productId}`
      );

      setMessage("product purchased successfully!");

      // Update the transportation list to reflect the seat decrement and booking closure
      const updatedProducts = products.map((product) =>
        product._id === productId
          ? { ...product, availableQuantity: product.availableQuantity - 1}
          : product
      );

      setProducts(updatedProducts);
      fetchProducts();
      //fetchTouristData();
      fetchPurchasedProducts();


      // Optionally, you can show the booked transportations separately below the available ones
      //fetchBookedTransportations();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error booking transportation:", error);
      setMessage("Failed to book transportation. Please try again.");
    }
  };

  const fetchTouristData = async () => {
    const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
    try {
      const response = await axios.get(
        `http://localhost:8000/home/tourist/getTourist/${userId}`
      );
      setTouristData(response.data);
      console.log(response.data);
      console.log(response.data.purchasedProducts);
      setPurchasedProducts(response.data.purchasedProducts);
      console.log(touristData);
      console.log(purchasedProducts);
    } catch (error) {
      console.error("Error fetching tourist data:", error);
    }
  };

  const fetchPurchasedProducts = async () => {
    const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
    if (!userId) {
      setMessage("User ID not found in local storage. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/home/tourist/getPurchasedProducts/${userId}`);
      setPurchasedProductDetails(response.data);
    } catch (error) {
      console.error("Error fetching purchased products:", error);
      setMessage("Failed to fetch purchased products. Please try again later.");
    }
  };


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

  const handleRatingChange = (e, productId) => {
    setPurchasedProductDetails((prevDetails) =>
      prevDetails.map((product) =>
        product._id === productId
          ? { ...product, newRating: e.target.value }
          : product
      )
    );
  };
  
  // Handle review input change
  const handleReviewChange = (e, productId) => {
    setPurchasedProductDetails((prevDetails) =>
      prevDetails.map((product) =>
        product._id === productId
          ? { ...product, newReview: e.target.value }
          : product
      )
    );
  };

  // Function to handle rating submission
// Function to handle rating submission
const handleSubmitRating = async (productId) => {
  const product = purchasedProductDetails.find((prod) => prod._id === productId);

  if (product && product.newRating) {
    try {
      const response = await fetch(`${API_URL}/home/tourist/rateProduct/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: parseInt(product.newRating, 10) })
      });
      
      if (response.ok) {
        const data = await response.json();

        // Update the product details with the new average rating and reset the rating input
        setPurchasedProductDetails((prevDetails) =>
          prevDetails.map((prod) =>
            prod._id === productId
              ? {
                  ...prod,
                  rating: data.avgRating, // Update with the new average rating
                  newRating: ''           // Reset newRating input field
                }
              : prod
          )
        );

        // Re-fetch products to update the list with the new rating
        await fetchProducts();
      } else {
        console.error('Error submitting rating:', response.statusText);
        setMessage('Failed to submit rating.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  } else {
    alert("Please enter a rating.");
  }
};

// Function to handle review submission
const handleSubmitReview = async (productId) => {
  const product = purchasedProductDetails.find((prod) => prod._id === productId);

  if (product && product.newReview) {
    try {
      const response = await fetch(`${API_URL}/home/tourist/reviewProduct/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: product.newReview })
      });
      
      if (response.ok) {
        const data = await response.json();

        // Update the specific product's reviews and reset the new review input
        setPurchasedProductDetails((prevDetails) =>
          prevDetails.map((prod) =>
            prod._id === productId
              ? {
                  ...prod,
                  reviewsText: [...prod.reviewsText, product.newReview], // Append the new review
                  newReview: ''                                         // Reset newReview input field
                }
              : prod
          )
        );

        // Re-fetch products to update the list with the new review
        await fetchProducts();
      } else {
        console.error('Error submitting review:', response.statusText);
        setMessage('Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  } else {
    setMessage("Please enter a review.");
  }
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
        
        {/* Back Button */}
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

        {/* Add/Edit Product Button */}
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

        {/* Search and Filters */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              filterProducts(e.target.value, minPrice, maxPrice, sortOrder);
            }}
            style={{
              padding: '10px',
              width: '300px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              marginRight: '10px',
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
              padding: '10px',
              width: '150px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              marginRight: '10px',
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
              padding: '10px',
              width: '150px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
        </div>

        {/* Sort by rating */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              filterProducts(searchTerm, minPrice, maxPrice, e.target.value);
            }}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
              backgroundColor: '#fff',
            }}
          >
            <option value="asc">Sort by Rating: Low to High</option>
            <option value="desc">Sort by Rating: High to Low</option>
          </select>
        </div>
\
        {/* Product List */}
<section>
  <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>Product List</h2>
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
        <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Average Rating</th>
        <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Available Quantity</th>
        <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
          <tr key={product._id} style={{ textAlign: 'center' }}>
            <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
              {product.pictures ? (
                <img 
                  src={`data:image/png;base64,${product.pictures}`} 
                  alt="Product" 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
                />
              ) : (
                'No Image'
              )}
            </td>
            <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
    <button
        onClick={() => handleAddToCart(product._id)}
        style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        }}
    >
        Add to Cart
    </button>
</td>

            <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.description}</td>
            <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>${product.price}</td>
            <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.seller && product.seller.Name ? product.seller.Name : 'No Seller'}</td>
            <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
              {/* Display average rating as stars */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', color: '#FFD700', marginRight: '5px' }}>
                  {'★'.repeat(Math.round(product.avgRating))}{'☆'.repeat(5 - Math.round(product.avgRating))}
                </span>
                <span>({product.avgRating.toFixed(1)})</span>
              </div>
            </td>
            <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{product.availableQuantity}</td>
            <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>
              {product.availableQuantity > 0 ? (
                <button 
                  onClick={() => handleBooking(product._id)} 
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Buy Now
                </button>
                
              ) : (
                <button 
                  disabled 
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'not-allowed',
                  }}
                >
                  Out of Stock
                </button>
              )}
            </td>
          </tr>
          
        ))
      ) : (
        <tr>
          <td colSpan="7" style={{ padding: '10px', textAlign: 'center' }}>No products found</td>
        </tr>
      )}
    </tbody>
  </table>
  
  
  {/* Section to display reviews in a visually attractive way */}
  <section style={{ marginTop: '40px' }}>
    <h3 style={{ fontSize: '20px', color: '#333', textAlign: 'center', marginBottom: '20px' }}>Product Reviews</h3>
    {filteredProducts.map(product => (
      product.reviewsText && product.reviewsText.length > 0 ? (
        <div key={product._id} style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}>
          <h4 style={{ fontSize: '18px', color: '#333' }}>Reviews for {product.description}</h4>
          {product.reviewsText.map((review, index) => (
            <p key={index} style={{
              backgroundColor: '#fff',
              padding: '10px 15px',
              borderRadius: '5px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              color: '#555',
            }}>
              "{review}"
            </p>
          ))}
        </div>
      ) : null
    ))}
  </section>
</section>


        {/* Purchased Products */}
        {/* Purchased Products */}
{purchasedProductDetails.length > 0 && (
  <section style={{ marginTop: '40px' }}>
    <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>Purchased Products</h2>
    <ul style={{ listStyle: 'none', paddingLeft: '0', display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
      {purchasedProductDetails.map((product) => (
        <li key={product._id} style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <img 
            src={`data:image/png;base64,${product.pictures}`} 
            alt="Product" 
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
          />
          <h3 style={{ marginTop: '10px', fontSize: '20px', color: '#333' }}>{product.description}</h3>
          <p style={{ fontSize: '18px', color: '#777' }}>${product.price}</p>
          <p style={{ fontSize: '16px', color: '#555' }}>Seller: {product.seller?.name || 'Unknown'}</p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <span style={{ fontSize: '16px', color: '#333', marginRight: '10px' }}>Rating:</span>
            <span style={{ fontSize: '16px', color: '#FFD700' }}>⭐{product.avgRating}</span>
          </div>
          
          <p style={{ fontSize: '16px', color: '#333', marginTop: '10px' }}>Available Quantity: {product.availableQuantity}</p>
          <p style={{ fontSize: '16px', color: '#333' }}>Sales: {product.sales}</p>
          {product.isArchived && (
            <span style={{ fontSize: '14px', color: '#FF6347', marginTop: '10px' }}>This product is archived</span>
          )}

          {/* Rating and Review Input */}
          <div style={{
            marginTop: '15px', 
            padding: '15px', 
            width: '100%',
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <label style={{ fontSize: '16px', color: '#333' }}>Rate this product:</label>
            <input 
              type="number" 
              min="1" 
              max="5" 
              placeholder="1-5" 
              value={product.newRating || ''} 
              onChange={(e) => handleRatingChange(e, product._id)} 
              style={{
                margin: '10px 0', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                width: '100%'
              }} 
            />
            <button 
              onClick={() => handleSubmitRating(product._id)} 
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >Submit Rating</button>
            <button onClick={() => navigate("/cart")}>View Cart</button>

            <textarea 
              placeholder="Write your review here..." 
              value={product.newReview || ''} 
              onChange={(e) => handleReviewChange(e, product._id)} 
              style={{
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                minHeight: '80px',
                marginBottom: '10px'
              }} 
            ></textarea>
            <button 
              onClick={() => handleSubmitReview(product._id)} 
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Submit Review
            </button>
          </div>
        </li>
      ))}
    </ul>
  </section>
)}

        
      </div>
    </div>
  );
};

export default ProductListp;
