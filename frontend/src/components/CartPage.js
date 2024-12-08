import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const API_URL = 'http://localhost:8000';
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMessage('Please log in to view your cart.');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/home/tourist/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setMessage('Failed to load cart items.');
    }
  };

  const handleRemoveItem = async (productId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMessage('Please log in to remove items from your cart.');
      return;
    }

    try {
      await axios.delete(`${API_URL}/home/tourist/remove/${userId}/${productId}`);
      setCartItems(cartItems.filter((item) => item._id !== productId));
      setMessage('Item removed from cart successfully.');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setMessage('Failed to remove item from cart.');
    }
  };

  const handleCheckout = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setMessage('Please log in to proceed to checkout.');
      return;
    }
  
    // Navigate to the checkout page
    navigate('/checkout');
  };
  
  const handleUpdateQuantity = async (productId, newQuantity) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("Please log in to update item quantity.");
      return;
    }
  
    if (newQuantity < 1) {
      setMessage("Quantity cannot be less than 1.");
      return;
    }
  
    try {
      await axios.put(`${API_URL}/home/tourist/updateq`, {
        touristId: userId,
        productId,
        quantity: newQuantity,
      });
  
      // Update the cart items with the new quantity
      setCartItems(
        cartItems.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
  
      setMessage("Item quantity updated successfully.");
    } catch (error) {
      console.error("Error updating item quantity:", error);
  
      // Check if the error is related to exceeding available stock
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Failed to update item quantity.");
      }
    }
  };
  
  
  

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f7f8fa' }}>
      <h2>My Cart</h2>
      {message && <p>{message}</p>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Picture</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={`data:image/png;base64,${item.pictures}`}
                    alt="Product"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                </td>
                <td>{item.description}</td>
                <td>${item.price}</td>
                <td>
  <input
    type="number"
    min="1"
    value={item.quantity || 1}
    onChange={(e) =>
      handleUpdateQuantity(item._id, parseInt(e.target.value, 10))
    }
    style={{
      width: "60px",
      padding: "5px",
      textAlign: "center",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  />
</td>
                <td>${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cartItems.length > 0 && (
        <button
          onClick={handleCheckout}
          style={{
            padding: '10px 20px',
            marginTop: '20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Proceed to Checkout
        </button>
      )}
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: '#ff6348',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Back
      </button>
    </div>
  );
};

export default CartPage;
