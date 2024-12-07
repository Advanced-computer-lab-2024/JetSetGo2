import React, { useState, useEffect } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const touristId = localStorage.getItem("userId");

      if (!touristId) {
        console.error("User ID not found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
         ` http://localhost:8000/home/tourist/getPurchasedProducts/${touristId}`
        );
        setOrders(response.data); // Assuming purchasedProducts is populated with product details and quantity
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
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
                <strong>Total:</strong> ${(order.product.price * order.quantity).toFixed(2)}
              </p>
              <p>
                <strong>Seller:</strong> {order.product.sellerDetails?.name || "Unknown"} (
                {order.product.sellerDetails?.role || "Unknown Role"})
              </p>
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