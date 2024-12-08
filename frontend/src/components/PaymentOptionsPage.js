import React, { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentOptionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addressId, productId } = location.state; // Get the product ID and address from location state
  const [showPopup, setShowPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const API_URL = 'http://localhost:8000';
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

  const handlePayment = (method) => {
    if (method === "cash") {
      setShowPopup(true); // Show confirmation popup for cash on delivery
    } else {
      console.log(`Selected payment method: ${method}, Address ID: ${addressId}`);
      // Handle other payment methods
    }
  };

  const confirmOrder = async () => {
    const touristId = localStorage.getItem("userId"); // Get tourist ID from local storage
  
    if (!touristId) {
      alert("User ID is missing. Please log in.");
      return;
    }
  
    // Extract product IDs from cartItems
    const productIds = cartItems.map((item) => item._id);
  
    if (productIds.length === 0) {
      alert("Cart is empty. Please add items to your cart.");
      return;
    }
  
    try {
      // Send product IDs, tourist ID, and address ID to the backend
      const response = await axios.post(`${API_URL}/home/tourist/buyProducts`, {
        touristId,
        productIds,
        addressId, // Include address ID if needed
      });
  
      alert("Order confirmed! Your products are on the way.");
      setShowPopup(false); // Close the popup
      navigate("/my-orders"); // Redirect to "My Orders" page
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again.");
    }
  };
  

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f7f8fa" }}>
      <h2>Payment Options</h2>
      <p>Selected Address ID: {addressId}</p>
      <button
        onClick={() => handlePayment("wallet")}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Pay with Wallet
      </button>
      <button
        onClick={() => handlePayment("credit_card")}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Pay with Credit Card
      </button>
      <button
        onClick={() => handlePayment("cash")}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#ffc107",
          color: "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cash on Delivery
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <h3>Confirm Your Order</h3>
          <p>Your product will be delivered soon. Do you want to confirm the order?</p>
          <button
            onClick={confirmOrder}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Confirm
          </button>
          <button
            onClick={() => setShowPopup(false)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentOptionsPage;
  