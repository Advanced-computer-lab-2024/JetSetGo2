import React, { useState, useEffect } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  // Function to fetch orders
  const fetchOrders = async () => {
    const touristId = localStorage.getItem("userId");

    if (!touristId) {
      console.error("User ID not found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/home/tourist/getPurchasedProducts/${touristId}`
      );
      setOrders(response.data); // Assuming purchasedProducts is populated with product details, quantity, and status
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const cancelOrder = async (orderId) => {
    const touristId = localStorage.getItem("userId");

    if (!touristId) {
      console.error("User ID not found. Please log in.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/home/tourist/${touristId}/cancelOrder/${orderId}` // Include touristId in the API URL
      );
      alert(response.data.message);
      fetchOrders(); // Refresh the orders after cancellation
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.error || "Failed to cancel order.");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Poll every 10 seconds for status updates
    const intervalId = setInterval(fetchOrders, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f7f8fa",
        minHeight: "100vh",
      }}
    >
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {orders.map((order) => (
            <li
              key={order.product._id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#fff",
              }}
            >
              <p>
                <strong>Product:</strong> {order.product.description}
              </p>
              <p>
                <strong>Price:</strong> ${order.product.price.toFixed(2)}
              </p>
              <p>
                <strong>Quantity:</strong> {order.quantity}
              </p>
              <p>
                <strong>Total:</strong> $
                {(order.product.price * order.quantity).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: order.status === "Shipped" ? "green" : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {order.status || "Pending"}
                </span>
              </p>
              <p>
                <strong>Seller:</strong>{" "}
                {order.product.sellerDetails?.name || "Unknown"} (
                {order.product.sellerDetails?.role || "Unknown Role"})
              </p>
              <button
                disabled={order.status === "Shipped"} // Disable the button if shipped
                onClick={() => cancelOrder(order._id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor:
                    order.status === "Shipped" ? "#ccc" : "#ff4d4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    order.status === "Shipped" ? "not-allowed" : "pointer",
                }}
              >
                Cancel Order
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
};

export default MyOrders;
