import React, { useState, useEffect } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const touristId = localStorage.getItem("userId");

      try {
        const response = await axios.get(`http://localhost:8000/home/tourist/getPurchasedProducts/${touristId}`);
        setOrders(response.data);
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
        <ul>
          {orders.map((order) => (
            <li key={order._id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd" }}>
              <p><strong>Product:</strong> {order.description}</p>
              <p><strong>Price:</strong> ${order.price}</p>
              <p><strong>Seller:</strong> {order.sellerDetails?.name || "Unknown"}</p>
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
