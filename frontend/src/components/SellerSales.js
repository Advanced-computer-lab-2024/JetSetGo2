import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerRevenuePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sellerId = localStorage.getItem("userId"); // Replace with actual logic to get the logged-in seller's ID

  useEffect(() => {
    const fetchSellerRevenue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/seller/revenue/${sellerId}`
        );

        setProducts(response.data.products);
        setFilteredProducts(response.data.products); // Set initially to all products

        // Calculate total revenue
        const total = response.data.products.reduce((acc, product) => {
          return acc + product.sales * product.price * 0.9; // 10% platform fee
        }, 0);

        setTotalRevenue(total);
      } catch (error) {
        console.error("Error fetching seller revenue:", error);
        setError("Failed to load seller revenue data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerRevenue();
  }, [sellerId]);

  // Apply frontend filtering
  useEffect(() => {
    let filtered = products;

    // Filter by product name
    if (productFilter) {
      filtered = filtered.filter((product) =>
        product.description?.toLowerCase().includes(productFilter.toLowerCase())
      );
    }

    // Filter by date (if products have a date property)
    if (dateFilter) {
      filtered = filtered.filter(
        (product) =>
          new Date(product.date).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    // Filter by month
    if (monthFilter) {
      filtered = filtered.filter(
        (product) =>
          new Date(product.date).getFullYear() ===
            new Date(monthFilter).getFullYear() &&
          new Date(product.date).getMonth() === new Date(monthFilter).getMonth()
      );
    }

    setFilteredProducts(filtered);

    // Recalculate total revenue
    const total = filtered.reduce((acc, product) => {
      return acc + product.sales * product.price * 0.9;
    }, 0);
    setTotalRevenue(total);
  }, [productFilter, dateFilter, monthFilter, products]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Seller Revenue Dashboard</h1>
      <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
      <div>
        <input
          type="text"
          placeholder="Filter by product name"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        />
        <input
          type="date"
          placeholder="Filter by date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <input
          type="month"
          placeholder="Filter by month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />
      </div>
      <h3>Sold Products</h3>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
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
