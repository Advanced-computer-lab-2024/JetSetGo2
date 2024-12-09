import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerRevenuePage = () => {
  const [products, setProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sellerId = localStorage.getItem("userId"); // Replace with actual logic to get the logged-in seller's ID

  useEffect(() => {
    const fetchSellerRevenue = async () => {
      try {
        console.log("Fetching products for seller ID:", sellerId); // Debugging
        const response = await axios.get(
          `http://localhost:8000/api/seller/revenue/${sellerId}`
        );
        console.log("Products fetched:", response.data.products); // Debugging

        setProducts(response.data.products);

        // Calculate total revenue
        const total = response.data.products.reduce((acc, product) => {
          return acc + product.sales * product.price * 0.9; // 10% platform fee
        }, 0);

        setTotalRevenue(total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching seller revenue:", error);
        setError("Failed to load seller revenue data.");
        setLoading(false);
      }
    };

    fetchSellerRevenue();
  }, [sellerId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Seller Revenue Dashboard</h1>
      <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
      <h3>Sold Products</h3>
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <h4>Product Name: {product.description || "Unnamed Product"}</h4>
            <p>Price: ${product.price || 0}</p>
            <p>Sales Count: {product.sales || 0}</p>
            <p>
              Revenue from this product: $
              {(product.price * product.sales * 0.9).toFixed(2)}
            </p>
          </div>
        ))
      ) : (
        <p>No products found for this seller.</p>
      )}
    </div>
  );
};

export default SellerRevenuePage;
