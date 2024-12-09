import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Wishlist.css"; // Import the CSS file for styling

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId"); // Fetch userId from local storage

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
      fetchWishlist(); // Refresh wishlist
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>
      {message && <p className="wishlist-message">{message}</p>}
      {wishlist.length > 0 ? (
        <div className="card-container">
          {wishlist.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.pictures || "https://via.placeholder.com/150"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <div className="product-actions">
                  <button
                    className="action-button"
                    onClick={() => handleRemove(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
