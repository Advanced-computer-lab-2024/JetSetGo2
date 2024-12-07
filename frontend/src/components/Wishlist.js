import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      <h1>Your Wishlist</h1>
      {message && <p>{message}</p>}
      {wishlist.length > 0 ? (
        <ul>
          {wishlist.map((product) => (
            <li key={product._id}>
              <strong>{product.name}</strong> - ${product.price}
              <button onClick={() => handleRemove(product._id)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
